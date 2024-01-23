document.addEventListener("DOMContentLoaded", function () {
  // Ambil elemen tbody dari tabel saldo dan transaksi
  const saldoTable = document.getElementById("saldo");
  const transaksiTable = document.getElementById("transaksi");
  let users;

  // Fungsi untuk mengambil data pengguna dari server
  function fetchData() {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => {
        users = data;
        console.log("Data pengguna setelah fetch:", users);
        // Panggil fungsi untuk mengisi tabel saldo dan transaksi
        fillSaldoTable(users);
        fillTransaksiTable(users);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Fungsi untuk mengisi tabel transaksi
  function fillTransaksiTable(users) {
    transaksiTable.innerHTML = ""; // Kosongkan tabel sebelum mengisi ulang

    users.forEach((user) => {
      const row = transaksiTable.insertRow();
      row.insertCell(0).textContent = user.id;
      row.insertCell(1).textContent = user.nominal;
      row.insertCell(2).textContent = user.jenis;
      row.insertCell(3).textContent = user.tanggal;

      // Tambahkan tombol "Edit" pada setiap baris
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editData(user.id));
      row.insertCell(4).appendChild(editButton);
    });
  }

  // Fungsi untuk mengisi tabel saldo
  function fillSaldoTable(users) {
    saldoTable.innerHTML = ""; // Kosongkan tabel sebelum mengisi ulang

    users.forEach((user) => {
      const saldo = calculateSaldo(user.id, users);
      const row = saldoTable.insertRow();
      row.insertCell(0).textContent = user.id;
      row.insertCell(1).textContent = user.nama;
      row.insertCell(2).textContent = saldo;
    });
  }

  // Panggil fungsi fetchData saat halaman dimuat
  fetchData();

  // Skrip JavaScript untuk menangani formulir
  document.getElementById("tambahDataButton").addEventListener("click", tambahData);

  function tambahData() {
    // Ambil nilai dari formulir
    const id = document.getElementById("id").value;
    const nama = document.getElementById("nama").value;
    const nominal = document.getElementById("nominal").value;
    const jenis = document.getElementById("jenis").value;
    const tanggal = document.getElementById("tanggal").value;

    // Buat objek data baru
    const newData = {
      id: id,
      nama: nama,
      nominal: nominal,
      jenis: jenis,
      tanggal: tanggal,
    };
    console.log("Data baru:", newData);

    // Panggil fungsi untuk menambahkan data
    tambahkanDataKeTabel(newData);

    // Kosongkan formulir setelah menambahkan data
    document.getElementById("dataForm").reset();
  }

  function tambahkanDataKeTabel(newData) {
    // Simpan data baru ke dalam tabel transaksi
    const rowTransaksi = transaksiTable.insertRow();
    rowTransaksi.insertCell(0).textContent = newData.id;
    rowTransaksi.insertCell(1).textContent = newData.nominal;
    rowTransaksi.insertCell(2).textContent = newData.jenis;
    rowTransaksi.insertCell(3).textContent = newData.tanggal;

    // Tambahkan kolom untuk tombol aksi (edit dan hapus)
    const cellActions = rowTransaksi.insertCell(4);

    // Tombol Edit
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editData(newData.id));
    cellActions.appendChild(editButton);

    // Tombol Hapus
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Hapus";
    deleteButton.addEventListener("click", () => hapusData(newData.id));
    cellActions.appendChild(deleteButton);

    // Perbarui atau tambahkan saldo ke dalam tabel saldo
    const existingRowSaldo = Array.from(saldoTable.rows).find((row) => row.cells[0].textContent === newData.id);
    if (existingRowSaldo) {
      // Update saldo jika baris sudah ada
      const existingSaldo = parseInt(existingRowSaldo.cells[2].textContent);
      const updatedSaldo = newData.jenis === "Debit" ? existingSaldo + parseInt(newData.nominal) : existingSaldo - parseInt(newData.nominal);
      existingRowSaldo.cells[2].textContent = updatedSaldo;
    } else {
      // Tambahkan baru jika baris belum ada
      const rowSaldo = saldoTable.insertRow();
      rowSaldo.insertCell(0).textContent = newData.id;
      rowSaldo.insertCell(1).textContent = newData.nama;
      rowSaldo.insertCell(2).textContent = newData.nominal;
    }
  }

  function hapusData(id) {
    // Hapus data dari tabel transaksi
    const indexTransaksi = Array.from(transaksiTable.rows).findIndex((row) => row.cells[0].textContent === id);
    if (indexTransaksi !== -1) {
      transaksiTable.deleteRow(indexTransaksi);
    }

    // Hapus data dari tabel saldo
    const indexSaldo = Array.from(saldoTable.rows).findIndex((row) => row.cells[0].textContent === id);
    if (indexSaldo !== -1) {
      saldoTable.deleteRow(indexSaldo);
    }
  }

  function editData(id) {}

  function calculateSaldo(userId, users) {
    // Lakukan pengecekan untuk menghindari kesalahan jika users tidak didefinisikan
    if (users && users.length > 0) {
      // Filter transaksi yang sesuai dengan ID pengguna
      const userTransactions = users.filter((user) => user.id === userId);

      // Hitung saldo berdasarkan transaksi yang sesuai
      const saldo = userTransactions.reduce((acc, user) => {
        if (user.jenis === "Debet") {
          return acc + parseInt(user.nominal);
        } else {
          return acc - parseInt(user.nominal);
        }
      }, 0);

      return saldo;
    } else {
      console.error("Users is undefined or empty");
      return 0; // Atau nilai default sesuai kebutuhan
    }
  }
});
