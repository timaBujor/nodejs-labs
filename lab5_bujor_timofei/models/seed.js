const { Teacher, Course } = require('./index');

// Начальные данные: добавляются только если таблица преподавателей пустая
async function seedIfEmpty() {
    const count = await Teacher.count();
    if (count > 0) return;

    const ivanov = await Teacher.create({
        name: 'Ivan Ivanov', email: 'ivanov@example.com',
        department: 'Informatics', academicDegree: 'Doctor'
    });
    const rusu = await Teacher.create({
        name: 'Maria Rusu', email: 'rusu@example.com',
        department: 'Information Technology', academicDegree: 'PhD'
    });
    const ciobanu = await Teacher.create({
        name: 'Andrei Ciobanu', email: 'ciobanu@example.com',
        department: 'Software Engineering', academicDegree: 'Master'
    });

    await Course.bulkCreate([
        { title: 'Server-side Programming', credits: 5, semester: 1, teacherId: ivanov.id,
          description: 'Development of server-side applications using Node.js' },
        { title: 'Web Design', credits: 3, semester: 1, teacherId: ivanov.id,
          description: 'HTML, CSS and principles of user interface design' },
        { title: 'Databases', credits: 4, semester: 2, teacherId: rusu.id,
          description: 'Relational databases, SQL and database design' },
        { title: 'Node.js Advanced', credits: 6, semester: 3, teacherId: ciobanu.id,
          description: 'Express.js, REST API, middleware and application architecture' },
        { title: 'Operating Systems', credits: 5, semester: 4, teacherId: rusu.id,
          description: 'Processes, memory management and file systems' }
    ]);

    console.log('Initial data added');
}

module.exports = seedIfEmpty;
