#!/usr/bin/env python3
"""Register the on-device-only PDF renderer in Capacitor's generated Android app.

Capacitor Android platform is intentionally created from npm on every CI build.
"""
from pathlib import Path
import re
import shutil

root=Path(__file__).resolve().parents[1]
src=root/'native'/'TextbookPdfPlugin.java'
dest=root/'android'/'app'/'src'/'main'/'java'/'com'/'cpcacademy'/'app'
if not dest.is_dir():
    raise SystemExit('Generated Capacitor Android app not found; run `npx cap add android` first.')
main=dest/'MainActivity.java'
if not main.is_file():
    raise SystemExit(f'MainActivity.java not found at {main}')
shutil.copy2(src,dest/'TextbookPdfPlugin.java')
text=main.read_text(encoding='utf-8')
if 'registerPlugin(TextbookPdfPlugin.class);' not in text:
    if 'public class MainActivity extends BridgeActivity {' not in text:
        raise SystemExit('Unexpected MainActivity template; refusing unsafe edit')
    text=text.replace('public class MainActivity extends BridgeActivity {',
       '''public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(android.os.Bundle savedInstanceState) {
    registerPlugin(TextbookPdfPlugin.class);
    super.onCreate(savedInstanceState);
  }
''')
main.write_text(text,encoding='utf-8')
print('Installed TextbookPdf native Android plugin:',dest/'TextbookPdfPlugin.java')
print('Native plugin registered in MainActivity:',main)