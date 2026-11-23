// Данные хранятся в массиве (после перезапуска сервера изменения теряются)
const courses = [
    {
        id: 1,
        title: 'Server-side Programming',
        teacher: 'Vlada Visnevski',
        credits: 5,
        semester: 1,
        description: 'Development of server-side applications using Node.js'
    },
    {
        id: 2,
        title: 'Databases',
        teacher: 'Nartea Nikita',
        credits: 4,
        semester: 2,
        description: 'Relational databases, SQL and database design'
    },
    {
        id: 3,
        title: 'Web Design',
        teacher: 'Vlada Visnevski',
        credits: 3,
        semester: 1,
        description: 'HTML, CSS and principles of user interface design'
    },
    {
        id: 4,
        title: 'Node.js Advanced',
        teacher: 'Vlada Visnevski',
        credits: 6,
        semester: 3,
        description: 'Express.js, REST API, middleware and application architecture'
    },
    {
        id: 5,
        title: 'Operating Systems',
        teacher: 'Elena Popa',
        credits: 5,
        semester: 4,
        description: 'Processes, memory management and file systems'
    }
];

function getAll(search, semester) {
    let result = courses;

    if (search) {
        const s = search.toLowerCase();
        result = result.filter(c =>
            c.title.toLowerCase().includes(s) ||
            c.teacher.toLowerCase().includes(s)
        );
    }

    if (semester) {
        result = result.filter(c => c.semester === Number(semester));
    }

    return result;
}

function getById(id) {
    return courses.find(c => c.id === Number(id));
}

function create(data) {
    const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
    const course = { id: newId, ...data };
    courses.push(course);
    return course;
}

function update(id, data) {
    const course = getById(id);
    if (!course) return null;
    Object.assign(course, data);
    return course;
}

function remove(id) {
    const index = courses.findIndex(c => c.id === Number(id));
    if (index === -1) return false;
    courses.splice(index, 1);
    return true;
}

module.exports = { courses, getAll, getById, create, update, remove };
