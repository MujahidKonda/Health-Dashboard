document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';
    const username = 'coalition';
    const password = 'skills-test';

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': 'Basic ' + btoa(username + ':' + password),
        }
    })
    .then(response => response.json())
    .then(data => {
        const patientName = 'Jessica Taylor';
        const patient = data.find(p => p.name === patientName); // Find the patient with the name "Jessica Taylor"

        if (patient) {
            document.getElementById('profileName').innerText = patient.name;
            document.getElementById('profilePicture').src = patient.profile_picture;
            document.getElementById('profileCardName').innerText = patient.name;
            document.getElementById('profileCardPicture').src = patient.profile_picture;
            document.getElementById('profileCardAge').innerText = patient.age;
            document.getElementById('profileCardInsurance').innerText = patient.insurance_type;

            const diagnosticList = document.getElementById('diagnosticList');
            patient.diagnostic_list.forEach(diagnostic => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${diagnostic.name}</td><td>${diagnostic.description}</td><td>${diagnostic.status}</td>`;
                diagnosticList.appendChild(row);
            });

            const labResults = document.getElementById('labResults');
            patient.lab_results.forEach(result => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${result}</span>
                    <button><img src="vectors/download.svg" alt="Download"></button>
                `;
                labResults.appendChild(li);
            });

            const buttons = document.querySelectorAll('#labResults button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    console.log('Downloaded!');
                });
            });

            const ctx = document.getElementById('bloodPressureChart').getContext('2d');
            const bloodPressureChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: patient.diagnosis_history.map(d => `${d.month} ${d.year}`),
                    datasets: [{
                        label: 'Systolic',
                        data: patient.diagnosis_history.map(d => d.blood_pressure.systolic.value),
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Diastolic',
                        data: patient.diagnosis_history.map(d => d.blood_pressure.diastolic.value),
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Blood Pressure Over Time'
                        }
                    }
                }
            });
        } else {
            console.error('Patient not found');
        }
    })
    .catch(error => console.error('Error fetching data:', error));
});
