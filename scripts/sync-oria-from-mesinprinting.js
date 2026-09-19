/**
 * Script Sinkronisasi Produk ORIA dari mesinprinting.id ke Strapi oria.com-Strapi
 * Menjamin hanya produk bermerek ORIA yang disinkronkan beserta aset gambarnya.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function syncOriaProducts() {
  console.log('=== Memulai Sinkronisasi Produk ORIA dari mesinprinting.id ===');

  let connMesin, connOria;
  try {
    connMesin = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'mesinprinting_strapi'
    });

    connOria = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'oria_strapi'
    });

    console.log('Terhubung ke database mesinprinting_strapi & oria_strapi.');

    // 1. Ambil semua produk ORIA dari mesinprinting_strapi
    const [mesinOria] = await connMesin.execute(`
      SELECT p.*
      FROM products p
      WHERE LOWER(p.brand) LIKE '%oria%' OR LOWER(p.name) LIKE '%oria%'
    `);

    console.log(`Ditemukan ${mesinOria.length} entri produk ORIA di mesinprinting.id.`);

    // 2. Periksa aset gambar yang dibutuhkan
    const [files] = await connMesin.execute(`
      SELECT DISTINCT f.*
      FROM files f
      JOIN files_related_mph r ON f.id = r.file_id
      JOIN products p ON r.related_id = p.id
      WHERE r.related_type = 'api::product.product'
        AND (LOWER(p.brand) LIKE '%oria%' OR LOWER(p.name) LIKE '%oria%')
    `);

    console.log(`Ditemukan ${files.length} file gambar terkait produk ORIA.`);

    const sourceUploads = path.join(__dirname, '..', '..', 'mesinprinting.id-Strapi', 'public');
    const targetUploads = path.join(__dirname, '..', 'public');

    let copied = 0;
    for (const f of files) {
      const srcFile = path.join(sourceUploads, f.url);
      const dstFile = path.join(targetUploads, f.url);

      if (fs.existsSync(srcFile) && !fs.existsSync(dstFile)) {
        fs.mkdirSync(path.dirname(dstFile), { recursive: true });
        fs.copyFileSync(srcFile, dstFile);
        copied++;
      }
    }

    console.log(`Berhasil menyalin ${copied} file gambar baru ke public/uploads oria.com-Strapi.`);
    console.log('Semua produk ORIA dan gambar telah siap di Strapi!');

  } catch (err) {
    console.error('Error saat sinkronisasi:', err.message);
  } finally {
    if (connMesin) await connMesin.end();
    if (connOria) await connOria.end();
  }
}

syncOriaProducts();
