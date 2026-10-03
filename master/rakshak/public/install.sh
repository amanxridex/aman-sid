#!/usr/bin/env sh
# Rakshak Zero-Trust Defense Matrix — macOS & Linux One-Line Installer
# Usage: curl -fsSL https://rakshakus.vercel.app/install.sh | bash

set -e

echo "\033[1;36m============================================================\033[0m"
echo "\033[1;37m     RAKSHAK ZERO-TRUST DEFENSE MATRIX INSTALLER (v1.0.0)   \033[0m"
echo "\033[1;36m============================================================\033[0m"

INSTALL_DIR="$HOME/.rakshak"
BIN_DIR="$INSTALL_DIR/bin"
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"

if [ "$OS" = "darwin" ]; then
    BUNDLE_URL="https://rakshakus.vercel.app/releases/rakshak-macos-universal.zip"
    TEMP_FILE="/tmp/rakshak-macos.zip"
    EXPECTED_HASH="b3432551349f7470b9421ab385c449e45f8bf81fac8c8de0b9c7ccd1a233ec32"
    echo "\033[1;33m[1/5] Detected macOS (Darwin). Downloading bundle...\033[0m"
    curl -fsSL "$BUNDLE_URL" -o "$TEMP_FILE"
    
    echo "\033[1;33m[2/5] Verifying SHA-256 cryptographic checksum...\033[0m"
    if command -v shasum >/dev/null 2>&1; then
        COMPUTED_HASH="$(shasum -a 256 "$TEMP_FILE" | awk '{print $1}')"
    else
        COMPUTED_HASH="$(openssl dgst -sha256 "$TEMP_FILE" | awk '{print $NF}')"
    fi
    
    if [ "$COMPUTED_HASH" != "$EXPECTED_HASH" ]; then
        echo "\033[1;31m[FATAL] Checksum verification failed!\033[0m"
        echo "Expected: $EXPECTED_HASH"
        echo "Computed: $COMPUTED_HASH"
        rm -f "$TEMP_FILE"
        exit 1
    fi
    echo "      \033[1;32m[OK] Checksum Verified: $COMPUTED_HASH\033[0m"

    echo "\033[1;33m[3/5] Extracting to $INSTALL_DIR...\033[0m"
    rm -rf "$INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
    unzip -q -o "$TEMP_FILE" -d "/tmp/rakshak_extract"
    mv /tmp/rakshak_extract/rakshak/* "$INSTALL_DIR/"
    rm -rf "$TEMP_FILE" /tmp/rakshak_extract
else
    BUNDLE_URL="https://rakshakus.vercel.app/releases/rakshak-linux-x64.tar.gz"
    TEMP_FILE="/tmp/rakshak-linux.tar.gz"
    EXPECTED_HASH="90c451cecf9b89a2546e310f2326cebe311327f71b081b34d946469af896f656"
    echo "\033[1;33m[1/5] Detected Linux. Downloading bundle...\033[0m"
    curl -fsSL "$BUNDLE_URL" -o "$TEMP_FILE"

    echo "\033[1;33m[2/5] Verifying SHA-256 cryptographic checksum...\033[0m"
    if command -v sha256sum >/dev/null 2>&1; then
        COMPUTED_HASH="$(sha256sum "$TEMP_FILE" | awk '{print $1}')"
    else
        COMPUTED_HASH="$(shasum -a 256 "$TEMP_FILE" | awk '{print $1}')"
    fi

    if [ "$COMPUTED_HASH" != "$EXPECTED_HASH" ]; then
        echo "\033[1;31m[FATAL] Checksum verification failed!\033[0m"
        echo "Expected: $EXPECTED_HASH"
        echo "Computed: $COMPUTED_HASH"
        rm -f "$TEMP_FILE"
        exit 1
    fi
    echo "      \033[1;32m[OK] Checksum Verified: $COMPUTED_HASH\033[0m"

    echo "\033[1;33m[3/5] Extracting to $INSTALL_DIR...\033[0m"
    rm -rf "$INSTALL_DIR"
    mkdir -p "$INSTALL_DIR"
    tar -xzf "$TEMP_FILE" -C "/tmp"
    mv /tmp/rakshak/* "$INSTALL_DIR/"
    rm -rf "$TEMP_FILE" /tmp/rakshak
fi

echo "\033[1;33m[4/5] Setting execution permissions...\033[0m"
chmod +x "$BIN_DIR/rakshak" "$BIN_DIR/rskc"

echo "\033[1;33m[5/5] Configuring PATH in shell profiles...\033[0m"
EXPORT_CMD="export PATH=\"$BIN_DIR:\$PATH\""

for PROFILE in "$HOME/.zshrc" "$HOME/.bashrc" "$HOME/.profile"; do
    if [ -f "$PROFILE" ]; then
        if ! grep -q "$BIN_DIR" "$PROFILE"; then
            printf "\n# Rakshak Security Matrix\n%s\n" "$EXPORT_CMD" >> "$PROFILE"
            echo "      Added to $PROFILE"
        fi
    fi
done

if ! command -v node >/dev/null 2>&1; then
    echo "      \033[1;33m[NOTE] Node.js is recommended to execute Rakshak CLI.\033[0m"
fi

echo ""
echo "\033[1;32m============================================================\033[0m"
echo "\033[1;37m  DEPLOYMENT SUCCESSFUL: RAKSHAK IS NOW ACTIVE!\033[0m"
echo "\033[1;32m============================================================\033[0m"
echo "Installed Location: $INSTALL_DIR"
echo "Verified SHA-256:   $COMPUTED_HASH"
echo ""
echo "\033[1;36mAvailable Commands (run in a new terminal window):\033[0m"
echo "  rakshak --help     # Universal Security & Deception CLI"
echo "  rskc --help        # Rakshak Security Knowledge (.rsk) Compiler"
echo ""
echo "\033[1;33mQuickstart:\033[0m"
echo "  rakshak init"
echo "  rskc compile defense.rsk"
echo "\033[1;32m============================================================\033[0m"
