function formatRupiah(value) {
  return value.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

function formatDate(value) {
  return value.toLocaleString("id-ID", {
    dateStyle: "medium",
  });
}

module.exports = { formatRupiah, formatDate };
