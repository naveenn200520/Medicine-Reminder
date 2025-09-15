// Load data from localStorage on page load
window.onload = function() {
    loadMedicines();
    checkExpiryNotifications();
    setInterval(checkExpiryNotifications, 60000);
};

document.getElementById("addBtn").addEventListener("click", function() {
    const medName = document.getElementById("medicineName").value;
    const expiryDate = document.getElementById("expiryDate").value;

    if(medName === "" || expiryDate === ""){
        alert("Please enter all fields");
        return;
    }

    let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
    medicines.push({ name: medName, date: expiryDate });
    localStorage.setItem("medicines", JSON.stringify(medicines));

    loadMedicines();
    document.getElementById("medicineName").value = "";
    document.getElementById("expiryDate").value = "";
});

function loadMedicines(){
    const table = document.getElementById("medicineTable");
    table.innerHTML = `
        <tr>
            <th>Medicine</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Remove</th>
        </tr>`;

    let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
    const today = new Date();

    medicines.forEach((med, index) => {
        const row = table.insertRow();
        row.insertCell(0).innerText = med.name;
        row.insertCell(1).innerText = med.date;

        let expDate = new Date(med.date);
        let cellStatus = row.insertCell(2);

        if(expDate < today){
            cellStatus.innerHTML = `<span class="status-expired">Expired</span>`;
        } else if ((expDate - today) / (1000*60*60*24) <= 7){
            cellStatus.innerHTML = `<span style="background:orange;color:white;padding:5px 10px;border-radius:20px;">Soon</span>`;
        } else {
            cellStatus.innerHTML = `<span class="status-valid">Valid</span>`;
        }

        let cellRemove = row.insertCell(3);
        let btn = document.createElement("button");
        btn.innerText = "Remove";
        btn.onclick = function(){
            medicines.splice(index, 1);
            localStorage.setItem("medicines", JSON.stringify(medicines));
            loadMedicines();
        };
        cellRemove.appendChild(btn);
    });
}

// Notifications
if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
}

function checkExpiryNotifications() {
    let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
    const today = new Date().toISOString().split("T")[0];

    medicines.forEach(med => {
        if(med.date === today){
            if(Notification.permission === "granted"){
                new Notification("⚠️ Medicine Expiry Reminder", {
                    body: med.name + " expires today!"
                });
            } else {
                alert("⚠️ Reminder: " + med.name + " expires today!");
            }
        }
    });
}

// Search
function searchMedicine() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let rows = document.getElementById("medicineTable").rows;
    for (let i = 1; i < rows.length; i++) {
        let medName = rows[i].cells[0].innerText.toLowerCase();
        rows[i].style.display = medName.includes(input) ? "" : "none";
    }
}