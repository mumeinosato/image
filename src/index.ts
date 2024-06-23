import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputFolderPath = './input';
const outputFolderPath = './output';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function convertAllJpegsToPng(): Promise<void> {
  try {
    // Outputフォルダを空にする
    if (fs.existsSync(outputFolderPath)) {
      fs.readdirSync(outputFolderPath).forEach(file => {
        const filePath = path.join(outputFolderPath, file);
        fs.unlinkSync(filePath);
      });
    } else {
      fs.mkdirSync(outputFolderPath);
    }

    // 入力フォルダ内のファイルを取得
    const files = fs.readdirSync(inputFolderPath);
    const jpegFiles = files.filter(file => 
      path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.jpeg'
    );

    for (const file of jpegFiles) {
      const inputFilePath = path.join(inputFolderPath, file);
      const outputFilePath = path.join(outputFolderPath, `${path.basename(file, path.extname(file))}.png`);
      
      await sharp(inputFilePath)
        .png()
        .toFile(outputFilePath);

      console.log(`${file}を変換しましたわ。`);
    }

    // Inputフォルダを空にする（変換後一括削除）
    for (const file of jpegFiles) {
      const inputFilePath = path.join(inputFolderPath, file);
      try {
        fs.closeSync(fs.openSync(inputFilePath, 'r'));
        await delay(100); // 100ms待機
        fs.unlinkSync(inputFilePath);
      } catch (error) {
        console.error(`ファイル ${file} を削除中にエラーが発生しましたわ: `, error);
      }
    }

    console.log('全てのファイルの変換と移動が完了しましたわ。');
  } catch (error) {
    console.error('エラーが発生しましたわ: ', error);
  }
}

// 変換を実行
convertAllJpegsToPng();
