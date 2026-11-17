package com.cpcacademy.app;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.pdf.PdfRenderer;
import android.net.Uri;
import android.os.ParcelFileDescriptor;
import android.provider.OpenableColumns;
import android.util.Base64;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.security.MessageDigest;
import java.util.Locale;

/**
 * User-managed, on-device-only textbook PDF import and page rendering.
 * Uses Android's document picker; copies the selected PDF into app-private
 * storage once (not into APK). PdfRenderer rasterizes one page/crop at a time.
 * The plugin never uploads document bytes and does not expose a file path to JS.
 */
@CapacitorPlugin(name = "TextbookPdf")
public class TextbookPdfPlugin extends Plugin {
    private static final String PREFS = "cpc_textbook_pdf_v1";
    private static final String STORED_NAME = "textbook-user-import.pdf";
    private static final long MAX_FILE_BYTES = 850L * 1024L * 1024L;
    private static final String EXPECTED_SHA256 = "93ebab7cf67ddf978a242a855063f38d9aee724d3a6dbbf5dc5e90c33243de96";
    private static final int EXPECTED_PAGE_COUNT = 2137;

    private File documentFile() {
        return new File(getContext().getFilesDir(), STORED_NAME);
    }

    private JSObject status() {
        File file = documentFile();
        boolean exists = file.isFile() && file.length() > 0;
        JSObject result = new JSObject();
        result.put("available", exists);
        result.put("name", getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("name", ""));
        result.put("pageCount", exists ? getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).getInt("pages", 0) : 0);
        result.put("bytes", exists ? file.length() : 0L);
        result.put("sha256", exists ? getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("sha256", "") : "");
        result.put("editionMatched", exists && getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).getBoolean("matched", false));
        return result;
    }

    @PluginMethod
    public void getStatus(PluginCall call) {
        call.resolve(status());
    }

    @PluginMethod
    public void importPdf(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/pdf");
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivityForResult(call, intent, "onPdfChosen");
    }

    @ActivityCallback
    private void onPdfChosen(PluginCall call, ActivityResult activityResult) {
        if (call == null) return;
        if (activityResult.getResultCode() != Activity.RESULT_OK || activityResult.getData() == null) {
            call.reject("已取消选择 PDF，原导入文件不变。");
            return;
        }
        Uri uri = activityResult.getData().getData();
        if (uri == null) {
            call.reject("Android 文档选择器没有返回有效的 PDF。");
            return;
        }
        // Streaming avoids buffering potentially 100+ MB PDFs in the WebView.
        new Thread(() -> copyAndVerify(call, uri), "cpc-import-pdf").start();
    }

    private String displayName(Uri uri) {
        try (Cursor cursor = getContext().getContentResolver().query(uri, null, null, null, null)) {
            if (cursor != null && cursor.moveToFirst()) {
                int index = cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
                if (index >= 0) return cursor.getString(index);
            }
        } catch (Exception ignored) { }
        return "Imported textbook.pdf";
    }

    private void copyAndVerify(PluginCall call, Uri uri) {
        File temp = new File(getContext().getFilesDir(), STORED_NAME + ".partial");
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            long bytes = 0;
            try (InputStream input = getContext().getContentResolver().openInputStream(uri);
                 FileOutputStream output = new FileOutputStream(temp)) {
                if (input == null) throw new IllegalStateException("无法打开所选文档的内容。");
                byte[] buffer = new byte[64 * 1024];
                int n;
                while ((n = input.read(buffer)) != -1) {
                    bytes += n;
                    if (bytes > MAX_FILE_BYTES) throw new IllegalArgumentException("PDF 太大，超过 850 MB 设备端导入上限。");
                    digest.update(buffer, 0, n);
                    output.write(buffer, 0, n);
                }
                output.flush();
            }
            if (bytes < 1024) throw new IllegalArgumentException("文件为空或不是有效 PDF。");
            int count;
            // PdfRenderer requires a seekable file descriptor; the private copy is seekable.
            try (PdfRenderer renderer = new PdfRenderer(ParcelFileDescriptor.open(temp, ParcelFileDescriptor.MODE_READ_ONLY))) {
                count = renderer.getPageCount();
                if (count <= 0) throw new IllegalArgumentException("PDF 没有可读取的页面。");
            }
            StringBuilder sha = new StringBuilder();
            for (byte b : digest.digest()) sha.append(String.format(Locale.US, "%02x", b & 0xff));
            File target = documentFile();
            if (target.exists() && !target.delete()) throw new IllegalStateException("无法替换旧版导入文件。");
            if (!temp.renameTo(target)) throw new IllegalStateException("无法保存导入的 PDF，请检查手机剩余存储空间。");
            boolean matched = count == EXPECTED_PAGE_COUNT && sha.toString().equals(EXPECTED_SHA256);
            getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit()
                .putString("name", displayName(uri))
                .putString("sha256", sha.toString())
                .putInt("pages", count)
                .putBoolean("matched", matched)
                .apply();
            call.resolve(status());
        } catch (Exception exception) {
            if (temp.exists()) temp.delete();
            call.reject("PDF 导入失败：" + exception.getMessage());
        }
    }

    @PluginMethod
    public void removePdf(PluginCall call) {
        new Thread(() -> {
            File file = documentFile();
            if (file.exists() && !file.delete()) {
                call.reject("无法清除本地 PDF。");
                return;
            }
            getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().clear().apply();
            call.resolve(status());
        }, "cpc-remove-pdf").start();
    }

    @PluginMethod
    public void renderPage(PluginCall call) {
        int pageNumber = call.getInt("page", 0);
        int targetWidth = call.getInt("width", 1000);
        JSObject crop = call.getObject("crop");
        if (pageNumber < 1 || targetWidth < 1) {
            call.reject("PDF 页码或输出宽度不正确。");
            return;
        }
        new Thread(() -> {
            File file = documentFile();
            if (!file.isFile()) {
                call.reject("尚未导入 PDF，或本地文件已被删除。");
                return;
            }
            try (PdfRenderer renderer = new PdfRenderer(ParcelFileDescriptor.open(file, ParcelFileDescriptor.MODE_READ_ONLY))) {
                if (pageNumber > renderer.getPageCount()) {
                    call.reject("指定 PDF 页码超过实际总页数。");
                    return;
                }
                try (PdfRenderer.Page page = renderer.openPage(pageNumber - 1)) {
                    double cx = crop == null ? 0.0 : crop.optDouble("x", 0.0);
                    double cy = crop == null ? 0.0 : crop.optDouble("y", 0.0);
                    double cw = crop == null ? 1.0 : crop.optDouble("w", 1.0);
                    double ch = crop == null ? 1.0 : crop.optDouble("h", 1.0);
                    if (!Double.isFinite(cx) || !Double.isFinite(cy) || !Double.isFinite(cw) || !Double.isFinite(ch)
                            || cx < 0 || cy < 0 || cw < 0.05 || ch < 0.05 || cx + cw > 1.001 || cy + ch > 1.001) {
                        call.reject("图片范围设置不正确，请重置裁切坐标。");
                        return;
                    }
                    int width = Math.max(320, Math.min(1800, targetWidth));
                    int height = (int)Math.max(1, Math.round(width * ch * page.getHeight() / (cw * page.getWidth())));
                    if (height > 2400) {
                        width = Math.max(160, Math.round(width * 2400.0f / height));
                        height = 2400;
                    }
                    Bitmap bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
                    try {
                        Canvas canvas = new Canvas(bitmap);
                        canvas.drawColor(Color.WHITE);
                        float sx = (float)(width / (cw * page.getWidth()));
                        float sy = (float)(height / (ch * page.getHeight()));
                        Matrix matrix = new Matrix();
                        matrix.setValues(new float[]{sx, 0, (float)(-cx * page.getWidth() * sx), 0, sy, (float)(-cy * page.getHeight() * sy), 0, 0, 1});
                        page.render(bitmap, null, matrix, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
                        ByteArrayOutputStream bytes = new ByteArrayOutputStream();
                        if (!bitmap.compress(Bitmap.CompressFormat.JPEG, 85, bytes))
                            throw new IllegalStateException("无法生成本页图片。");
                        JSObject result = new JSObject();
                        result.put("dataUrl", "data:image/jpeg;base64," + Base64.encodeToString(bytes.toByteArray(), Base64.NO_WRAP));
                        result.put("width", width);
                        result.put("height", height);
                        result.put("page", pageNumber);
                        call.resolve(result);
                    } finally {
                        bitmap.recycle();
                    }
                }
            } catch (OutOfMemoryError oom) {
                call.reject("手机内存不足以渲染该页，请选择较低清晰度重试。");
            } catch (Exception exception) {
                call.reject("PDF 图片读取失败：" + exception.getMessage());
            }
        }, "cpc-render-pdf-" + pageNumber).start();
    }
}