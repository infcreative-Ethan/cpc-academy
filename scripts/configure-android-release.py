#!/usr/bin/env python3
"""Configure reproducible Android versioning and optional secure release signing."""
import os
import re
from pathlib import Path

gradle_path=Path("android/app/build.gradle")
text=gradle_path.read_text(encoding="utf-8")
build_code=int(os.environ.get("CPC_BUILD_CODE","1"))
if build_code<1 or build_code>2_000_000_000:
    raise ValueError("CPC_BUILD_CODE out of range")
text,n=re.subn(r"\bversionCode\s+\d+",f"versionCode {build_code}",text,count=1)
if n!=1:raise RuntimeError("Unable to locate Android versionCode")
text,n=re.subn(r'\bversionName\s+"[^"]+"',f'versionName "1.0.{build_code}"',text,count=1)
if n!=1:raise RuntimeError("Unable to locate Android versionName")

key_path=os.environ.get("CPC_ANDROID_KEYSTORE_FILE")
if key_path:
    # Passwords are read only from environment variables by Gradle, never written to disk.
    block='''
    signingConfigs {
        cpcRelease {
            storeFile file(System.getenv("CPC_ANDROID_KEYSTORE_FILE"))
            storePassword System.getenv("CPC_ANDROID_STORE_PASSWORD")
            keyAlias System.getenv("CPC_ANDROID_KEY_ALIAS")
            keyPassword System.getenv("CPC_ANDROID_KEY_PASSWORD")
        }
    }
'''
    if not all(os.environ.get(s) for s in ("CPC_ANDROID_STORE_PASSWORD","CPC_ANDROID_KEY_ALIAS","CPC_ANDROID_KEY_PASSWORD")):
        raise RuntimeError("Android signing environment variables missing")
    if not Path(key_path).is_file():
        raise RuntimeError("Android keystore file not found")
    text=text.replace("android {","android {"+block,1)
    text,n=re.subn(r"(buildTypes\s*\{\s*release\s*\{)",r"\1\n            signingConfig signingConfigs.cpcRelease",text,count=1)
    if n!=1:raise RuntimeError("Unable to locate release buildType")
gradle_path.write_text(text,encoding="utf-8")
print("Configured Android versionCode="+str(build_code)+(", signed release enabled" if key_path else ", debug-only mode"))
