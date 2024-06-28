document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const studentsTable = document.getElementById('studentsTable').getElementsByTagName('tbody')[0];

    const fileInputs = [
        { id: 'actaNacimiento', sizeDisplayId: 'fileSizeActaNacimiento' },
        { id: 'copiaCedula', sizeDisplayId: 'fileSizeCopiaCedula' },
        { id: 'certificadoBachiller', sizeDisplayId: 'fileSizeCertificadoBachiller' },
        { id: 'recordNotas', sizeDisplayId: 'fileSizeRecordNotas' },
        { id: 'certificadoMedico', sizeDisplayId: 'fileSizeCertificadoMedico' },
        { id: 'foto1', sizeDisplayId: 'fileSizeFoto1' }
    ];

    const loadStudents = () => {
        const students = JSON.parse(localStorage.getItem('students') || '[]');
        studentsTable.innerHTML = '';
        students.forEach((student, index) => {
            const row = studentsTable.insertRow();
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.nombreCompleto} ${student.apellido}</td>
                <td>${student.correoElectronico}</td>
                <td>${student.cedula}</td>
                <td>${student.nacionalidad}</td>
                <td>${student.direccion}</td>
                <td>${student.fechaRegistro}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeStudent(${index})">Eliminar</button>
                </td>
            `;
        });
    };

    window.removeStudent = (index) => {
        let students = JSON.parse(localStorage.getItem('students') || '[]');
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();
    };

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const files = fileInputs.map(input => {
            const fileInput = document.getElementById(input.id);
            const file = fileInput.files[0];
            if (!file) {
                alert(`Por favor, sube el documento: ${input.id}`);
                return null;
            }
            return { name: file.name, size: file.size };
        });

        if (files.includes(null)) return;

        const newStudent = {
            nombreCompleto: document.getElementById('nombreCompleto').value,
            apellido: document.getElementById('apellido').value,
            correoElectronico: document.getElementById('correoElectronico').value,
            cedula: document.getElementById('cedula').value,
            nacionalidad: document.getElementById('nacionalidad').value,
            direccion: document.getElementById('direccion').value,
            fechaRegistro: new Date().toLocaleString(),
            files: files
        };

        const students = JSON.parse(localStorage.getItem('students') || '[]');
        students.push(newStudent);
        localStorage.setItem('students', JSON.stringify(students));
        loadStudents();

        registerForm.reset();
        fileInputs.forEach(input => {
            document.getElementById(input.sizeDisplayId).innerText = '';
        });
    });

    fileInputs.forEach(input => {
        const fileInput = document.getElementById(input.id);
        const sizeDisplay = document.getElementById(input.sizeDisplayId);
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                sizeDisplay.innerText = `Tamaño: ${(file.size / 1024).toFixed(2)} KB`;
            } else {
                sizeDisplay.innerText = '';
            }
        });
    });

    const cedulaInput = document.getElementById('cedula');
    cedulaInput.addEventListener('input', () => {
        cedulaInput.value = cedulaInput.value.replace(/\D/g, '').slice(0, 9);
    });

    loadStudents();
});