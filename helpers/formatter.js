function formatRupiah(value) {
  return value.toLocateString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

module.exports = formatRupiah;
