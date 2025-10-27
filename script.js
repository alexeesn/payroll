const body = document.body;
const page = body.id;

if (page === "mainPage") {

    function handleSubmit(event) {
        event.preventDefault();

        if (!validationForm()) {
            return;
        }

        const formData = {
            idnum: document.querySelector("#idnum").value.trim(),
            lname: document.querySelector("#lname").value.trim(),
            fname: document.querySelector("#fname").value.trim(),
            mname: document.querySelector("#mname").value.trim() || 'N/A',
            position: document.querySelector("#position").value.trim(),
            rate: parseFloat(document.querySelector("#rate").value.trim()),
            days: parseInt(document.querySelector("#days").value.trim())
        };


        // Calculations
        const grossPay = formData.rate * formData.days;
        const sss = grossPay * 0.05;
        const pagIbig = grossPay * 0.03;
        const philHealth = grossPay * 0.02;
        const tax = grossPay * 0.05;
        const totalDeduction = sss + pagIbig + philHealth + tax;
        const netPay = grossPay - totalDeduction;

        formData.grossPay = grossPay;
        formData.sss = sss;
        formData.pagIbig = pagIbig;
        formData.philHealth = philHealth;
        formData.tax = tax;
        formData.totalDeduction = totalDeduction;
        formData.netPay = netPay;

        formData.fullName = `${formData.lname}, ${formData.fname} ${formData.mname}`;

        localStorage.setItem('employeeData', JSON.stringify(formData));
        saveToRecentSubmissions(formData);

        window.location.href = 'receipt.html';
    }

    function validationForm() {
        const requiredFields = ['idnum', 'lname', 'rate', 'days', 'position'];

        for (let field of requiredFields) {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                alert(`Please fill in the ${input.previousElementSibling.textContent} field`);
                input.focus();
                return false;
            }
        }

        const rate = parseFloat(document.querySelector('#rate').value);
        const days = parseInt(document.querySelector('#days').value);

        if (rate <= 0) {
            alert('Please input rate greater than 0');
            document.querySelector('#rate').focus();
            return false;
        }

        if (days <= 0) {
            alert('Please input days greater than 0');
            document.querySelector('#days').focus();
            return false;
        }

        return true;
    }

    function saveToRecentSubmissions(data) {
        let recentSubmission = JSON.parse(localStorage.getItem('recentSubmissions') || '[]');
        recentSubmission.unshift(data);
        if (recentSubmission.length > 5)
            recentSubmission = recentSubmission.slice(0, 5);
        localStorage.setItem('recentSubmissions', JSON.stringify(recentSubmission));
    }

    window.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('payrollForm');
        form.addEventListener('submit', handleSubmit);
    });
}

if (page === "receiptPage") {
    window.addEventListener('DOMContentLoaded', function() {
        const savedData = localStorage.getItem('employeeData');
        const receiptContent = document.getElementById('receiptContent');

        if (savedData) {
            const data = JSON.parse(savedData);

            document.getElementById('idnum').textContent = data.idnum;
            document.getElementById('fullName').textContent = data.fullName;
            document.getElementById('position').textContent = data.position;
            document.getElementById('rate').textContent = `₱${data.rate.toFixed(2)}`;
            document.getElementById('days').textContent = data.days;
            document.getElementById('grossPay').textContent = `₱${data.grossPay.toFixed(2)}`;
            document.getElementById('sss').textContent = `₱${data.sss.toFixed(2)}`;
            document.getElementById('pagIbig').textContent = `₱${data.pagIbig.toFixed(2)}`;
            document.getElementById('philHealth').textContent = `₱${data.philHealth.toFixed(2)}`;
            document.getElementById('tax').textContent = `₱${data.tax.toFixed(2)}`;
            document.getElementById('totalDeduction').textContent = `₱${data.totalDeduction.toFixed(2)}`;
            document.getElementById("netPay").textContent = `₱${data.netPay.toFixed(2)}`;
            

        } else {
            receiptContent.innerHTML = '<p>No employee data found. Please fill out the form first.</p>';
        }
    });
}

