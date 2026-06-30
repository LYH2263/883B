#!/usr/bin/env bash

set -euo pipefail

#######################################
# 基础配置
#######################################

SCRIPT_NAME=$(basename "$0")
ROOT_DIR=$(pwd)
DATE=$(date +"%y%m%d")

#######################################
# 帮助信息
#######################################

usage() {
  cat <<EOF
用法:
  $SCRIPT_NAME <id> [output_dir]

参数:
  id            项目标识（必填）
  output_dir    输出目录（可选，默认 ../）

示例:
  $SCRIPT_NAME projectA
  $SCRIPT_NAME projectA ../dist
EOF
}

#######################################
# 参数解析
#######################################

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

PROJECT_ID="$1"
OUTPUT_DIR="${2:-../}"
OUTPUT_PATH="${OUTPUT_DIR%/}/${PROJECT_ID}-${DATE}.zip"

#######################################
# 依赖校验
#######################################

if ! command -v zip >/dev/null 2>&1; then
  echo "❌ 未找到 zip 命令，请先安装"
  exit 1
fi

#######################################
# 排除规则（集中管理）
#######################################

EXCLUDES=(
  "frontend/node_modules/*"
  "frontend/dist/*"
  "frontend/.next/*"
  "backend/node_modules/*"
  "backend/dist/*"
  "backend/vendor/*"
  "node_modules/*"
  "dist/*"
  ".next/*"
  ".git/*"
  ".github/*"
  "AGENTS.md"
  "submit.md"
  "events.jsonl"
)

#######################################
# 构建 zip 参数
#######################################

ZIP_EXCLUDE_ARGS=()
for pattern in "${EXCLUDES[@]}"; do
  ZIP_EXCLUDE_ARGS+=("-x" "$pattern")
done

#######################################
# 开始打包
#######################################

echo "📦 项目打包开始"
echo "• 项目 ID     : $PROJECT_ID"
echo "• 当前日期   : $DATE"
echo "• 输出路径   : $OUTPUT_PATH"
echo "• 根目录     : $ROOT_DIR"
echo

if [[ -f "$OUTPUT_PATH" ]]; then
  echo "⚠️  已存在同名文件，将覆盖"
  rm -f "$OUTPUT_PATH"
fi

zip -r "$OUTPUT_PATH" . "${ZIP_EXCLUDE_ARGS[@]}"

echo
echo "✅ 打包完成"
echo "📁 文件位置: $OUTPUT_PATH"
