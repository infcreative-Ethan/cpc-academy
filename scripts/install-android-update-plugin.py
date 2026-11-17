#!/usr/bin/env python3
"""Register CPC Academy's secure APK downloader in the generated Capacitor Android project."""
from pathlib import Path
import re

base=Path("android/app/src/main")
main=base/"java/com/cpcacademy/app/MainActivity.java"
manifest=base/"AndroidManifest.xml"
plugin=base/"java/com/cpcacademy/app/CpcUpdaterPlugin.java"
if not main.is_file() or not manifest.is_file():
    raise RuntimeError("Capacitor-generated Android project is missing")

java=r'''package com.cpcacademy.app;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.InputStream;
import java.security.MessageDigest;
import java.util.Locale;

@CapacitorPlugin(name = "CpcUpdater")
public class CpcUpdaterPlugin extends Plugin {
    private static final String PREF = "cpc-update";
    private static final String DOWNLOAD = "downloadId";
    private static final String DIGEST = "sha256";
    private boolean verifying = false;
    private BroadcastReceiver receiver;

    @Override
    public void load() {
        receiver = new BroadcastReceiver() {
            @Override public void onReceive(Context context, Intent intent) {
                if (!DownloadManager.ACTION_DOWNLOAD_COMPLETE.equals(intent.getAction())) return;
                long id = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (id == preferences().getLong(DOWNLOAD, -2)) checkDownload();
            }
        };
        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= 33) {
            getContext().registerReceiver(receiver, filter, Context.RECEIVER_EXPORTED);
        } else {
            getContext().registerReceiver(receiver, filter);
        }
        checkDownload();
    }

    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        checkDownload();
    }

    @Override
    protected void handleOnDestroy() {
        if (receiver != null) {
            try { getContext().unregisterReceiver(receiver); } catch (Exception ignored) {}
            receiver = null;
        }
        super.handleOnDestroy();
    }

    private SharedPreferences preferences() {
        return getContext().getSharedPreferences(PREF, Context.MODE_PRIVATE);
    }

    @PluginMethod
    public void downloadAndInstall(PluginCall call) {
        String url = call.getString("url", "");
        String sha = call.getString("sha256", "");
        if (!url.startsWith("https://github.com/infcreative-Ethan/cpc-academy/releases/download/")
            || !url.endsWith("/CPC-Academy.apk")) {
            call.reject("Refusing untrusted update URL");
            return;
        }
        if (!sha.isEmpty() && !sha.matches("[a-fA-F0-9]{64}")) {
            call.reject("Invalid APK digest");
            return;
        }
        if (Build.VERSION.SDK_INT >= 26 && !getContext().getPackageManager().canRequestPackageInstalls()) {
            Intent settings = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES,
                Uri.parse("package:" + getContext().getPackageName()));
            getActivity().startActivity(settings);
            call.reject("请允许此 App 安装来自此来源的应用，然后重新点击下载。");
            return;
        }
        try {
            DownloadManager manager=(DownloadManager)getContext().getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request=new DownloadManager.Request(Uri.parse(url));
            request.setTitle("CPC Academy 更新");
            request.setDescription("正在下载已签名 APK");
            request.setMimeType("application/vnd.android.package-archive");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            request.setDestinationInExternalFilesDir(getContext(), Environment.DIRECTORY_DOWNLOADS,
                "CPC-Academy-" + System.currentTimeMillis() + ".apk");
            long id=manager.enqueue(request);
            preferences().edit().putLong(DOWNLOAD,id)
                .putString(DIGEST,sha.toLowerCase(Locale.US)).apply();
            JSObject result=new JSObject();
            result.put("status","downloading");
            call.resolve(result);
        } catch (Exception error) {
            call.reject("无法启动 APK 下载",error);
        }
    }

    private synchronized void checkDownload() {
        if (verifying) return;
        long id=preferences().getLong(DOWNLOAD,-1);
        if (id<0) return;
        DownloadManager manager=(DownloadManager)getContext().getSystemService(Context.DOWNLOAD_SERVICE);
        DownloadManager.Query query=new DownloadManager.Query().setFilterById(id);
        try (Cursor cursor=manager.query(query)) {
            if (cursor==null || !cursor.moveToFirst()) return;
            int status=cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            if (status==DownloadManager.STATUS_FAILED) {
                preferences().edit().remove(DOWNLOAD).remove(DIGEST).apply();
                Toast.makeText(getContext(),"APK 下载失败，请重试",Toast.LENGTH_LONG).show();
                return;
            }
            if (status!=DownloadManager.STATUS_SUCCESSFUL) return;
        } catch(Exception ignored) { return; }

        Uri downloaded=manager.getUriForDownloadedFile(id);
        if (downloaded==null) return;
        verifying=true;
        String expected=preferences().getString(DIGEST,"");
        new Thread(()->{
            boolean valid=expected.isEmpty() || checksumMatches(downloaded,expected);
            getActivity().runOnUiThread(()->{
                verifying=false;
                preferences().edit().remove(DOWNLOAD).remove(DIGEST).apply();
                if (!valid) {
                    manager.remove(id);
                    Toast.makeText(getContext(),"APK 校验失败，已取消安装",Toast.LENGTH_LONG).show();
                    return;
                }
                try {
                    Intent install=new Intent(Intent.ACTION_VIEW);
                    install.setDataAndType(downloaded,"application/vnd.android.package-archive");
                    install.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    getContext().startActivity(install);
                } catch(Exception error) {
                    Toast.makeText(getContext(),"请从系统下载通知打开 APK 并安装",Toast.LENGTH_LONG).show();
                }
            });
        }).start();
    }

    private boolean checksumMatches(Uri uri,String expected) {
        try (InputStream stream=getContext().getContentResolver().openInputStream(uri)) {
            if (stream==null) return false;
            MessageDigest md=MessageDigest.getInstance("SHA-256");
            byte[] buffer=new byte[64*1024];
            int n;
            while ((n=stream.read(buffer))!=-1) md.update(buffer,0,n);
            StringBuilder digest=new StringBuilder();
            for (byte b:md.digest()) digest.append(String.format(Locale.US,"%02x",b & 0xff));
            return digest.toString().equalsIgnoreCase(expected);
        } catch(Exception ignored) {return false;}
    }
}
'''
plugin.parent.mkdir(parents=True,exist_ok=True)
plugin.write_text(java,encoding="utf-8")

content=main.read_text(encoding="utf-8")
if "registerPlugin(CpcUpdaterPlugin.class);" not in content:
    # Preserve existing TextbookPdfPlugin and its onCreate registration.
    if "registerPlugin(TextbookPdfPlugin.class);" in content:
        content=content.replace("registerPlugin(TextbookPdfPlugin.class);",
            "registerPlugin(TextbookPdfPlugin.class);\n    registerPlugin(CpcUpdaterPlugin.class);",1)
    elif "super.onCreate(savedInstanceState);" in content:
        content=content.replace("super.onCreate(savedInstanceState);",
            "registerPlugin(CpcUpdaterPlugin.class);\n    super.onCreate(savedInstanceState);",1)
    else:
        raise RuntimeError("Unexpected MainActivity layout; refusing to overwrite native plugins")
    main.write_text(content,encoding="utf-8")

m=manifest.read_text(encoding="utf-8")
if "android.permission.REQUEST_INSTALL_PACKAGES" not in m:
    m=m.replace("<application",
        '<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />\n    <application',1)
    manifest.write_text(m,encoding="utf-8")
print("Registered native Android download-and-install updater")
