document.querySelector("form").addEventListener("submit", function(e) {
    const gambarInput = document.getElementById('gambar');
    const gambarFile = gambarInput.files[0];

    const flashMessageContainer = document.getElementById('flash-msg');
    const flashMessageText = document.getElementById('flash-message-text');

    // Memastikan hanya satu file yang dipilih
    if (gambarInput.files.length > 1) {
        flashMessageText.textContent = "Hanya satu file yang dapat diupload.";
        flashMessageContainer.classList.toggle('hidden')
        e.preventDefault(); // Mencegah form dikirim
        return;
    }

    // Memastikan file yang dipilih adalah gambar dengan ekstensi .jpg
    const validExtensions = ['image/jpeg'];
    if (!validExtensions.includes(gambarFile.type)) {
        flashMessageText.textContent = "Hanya file dengan ekstensi .jpg yang diperbolehkan!";
        flashMessageContainer.classList.toggle('hidden')
        e.preventDefault(); // Mencegah form dikirim
        return;
    }

    // Memastikan ukuran file tidak lebih dari 200KB
    const maxSize = 200 * 1024; // 200KB
    if (gambarFile.size > maxSize) {
        // const flashMsg = document.getElementById('flash-msg')
        flashMessageText.textContent = "Ukuran file tidak boleh lebih dari 200KB!";
        flashMessageContainer.classList.toggle('hidden')
        e.preventDefault(); // Mencegah form dikirim
        return;
    }
});
