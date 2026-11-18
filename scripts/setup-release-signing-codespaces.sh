#!/usr/bin/env bash
# One-time Android signing setup for GitHub Codespaces (no local computer needed).
# The private key is never added to Git and its value is never printed.
set -Eeuo pipefail
umask 077

REPO="infcreative-Ethan/cpc-academy"
PRIVATE_DIR=".private-signing"
KEYSTORE="$PRIVATE_DIR/cpc-academy-release.jks"
PASSFILE="$PRIVATE_DIR/signing-password.txt"
BACKUP="$PRIVATE_DIR/CPC-Academy-Signing-Backup.zip"
SECRETS="$PRIVATE_DIR/.github-secrets.tmp"

command -v keytool >/dev/null || { echo "Java keytool is missing in Codespaces."; exit 1; }
command -v openssl >/dev/null || { echo "OpenSSL is missing."; exit 1; }
command -v gh >/dev/null || { echo "GitHub CLI is missing."; exit 1; }
command -v python3 >/dev/null || { echo "Python 3 is missing."; exit 1; }

mkdir -p "$PRIVATE_DIR"
chmod 700 "$PRIVATE_DIR"

if [[ ! -e "$KEYSTORE" && -e "$PASSFILE" ]] || [[ -e "$KEYSTORE" && ! -e "$PASSFILE" ]]; then
  echo "ERROR: Incomplete existing signing backup. Restore both key and password; never generate a second key over an existing release identity."
  exit 1
fi

if [[ ! -e "$KEYSTORE" ]]; then
  PASS="$(openssl rand -hex 28)"
  printf '%s\n' "$PASS" > "$PASSFILE"
  chmod 600 "$PASSFILE"
  keytool -genkeypair -noprompt \
    -keystore "$KEYSTORE" -storetype PKCS12 \
    -alias cpcacademy -keyalg RSA -keysize 3072 \
    -validity 10000 \
    -dname "CN=CPC Academy Android Updates, OU=Release Signing, O=CPC Academy" \
    -storepass "$PASS" -keypass "$PASS" >/dev/null 2>&1
  chmod 600 "$KEYSTORE"
  echo "One permanent signing key created."
else
  echo "Reusing the existing signing key in this Codespace (no new key generated)."
fi

PASS="$(cat "$PASSFILE")"
keytool -list -keystore "$KEYSTORE" -storepass "$PASS" -alias cpcacademy >/dev/null 2>&1 ||
  { echo "ERROR: signing key/password verification failed."; exit 1; }

# Keep an owner-controlled recovery copy before writing any GitHub secrets.
python3 - "$KEYSTORE" "$PASSFILE" "$BACKUP" <<'PY'
import sys, zipfile
from pathlib import Path
key, password, destination = [Path(x) for x in sys.argv[1:]]
with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as out:
    out.write(key, arcname=key.name)
    out.write(password, arcname=password.name)
PY
chmod 600 "$BACKUP"

# GitHub CLI encrypts secrets before uploading; do not echo this file.
{
  printf 'CPC_ANDROID_KEYSTORE_B64=%s\n' "$(base64 < "$KEYSTORE" | tr -d '\r\n')"
  printf 'CPC_ANDROID_STORE_PASSWORD=%s\n' "$PASS"
  printf 'CPC_ANDROID_KEY_ALIAS=cpcacademy\n'
  printf 'CPC_ANDROID_KEY_PASSWORD=%s\n' "$PASS"
} > "$SECRETS"
chmod 600 "$SECRETS"

# Codespaces' default token sometimes has repo-content permission but not
# Actions secrets permission. If so, request a one-time owner approval in browser.
if gh secret set -R "$REPO" --env-file "$SECRETS" >/dev/null 2>&1; then
  UPLOADED=yes
else
  echo "GitHub requires an additional authorization to write Actions secrets."
  echo "Follow the GitHub CLI browser/device prompts. No password will be printed."
  if env -u GH_TOKEN -u GITHUB_TOKEN gh auth login \
      --hostname github.com --git-protocol https --web --scopes repo </dev/tty; then
    if env -u GH_TOKEN -u GITHUB_TOKEN gh secret set -R "$REPO" \
        --env-file "$SECRETS" >/dev/null; then
      UPLOADED=yes
    else
      UPLOADED=no
    fi
  else
    UPLOADED=no
  fi
fi
rm -f "$SECRETS"
if [[ "$UPLOADED" == yes ]]; then
  echo "SUCCESS: four release signing secrets saved to GitHub Actions."
  echo "NEXT: Download the private backup ZIP from the Codespaces file explorer."
  echo "WARNING: Keep the ZIP confidential and NEVER commit or share it."
  echo "RECOVERY FILE: $BACKUP"
  echo "DO NOT delete this Codespace until your backup ZIP is stored safely elsewhere."
else
  echo "Unable to authorize GitHub Actions secret uploads."
  echo "The signing key and recovery ZIP remain in $PRIVATE_DIR."
  echo "Do NOT regenerate the key, expose private material, or delete this Codespace."
  exit 1
fi
