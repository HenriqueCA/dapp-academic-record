import Navbar from './Navbar'

const StudentNavbar = ({ active }) => {
    const Links = [
        { name: "HISTÓRICO", link: "/estudante" },
        { name: "MATRICULA", link: "/estudante/matricula" },
        { name: "PERFIL", link: "/estudante/perfil" },
        { name: "SAIR", link: "" }
    ];
    return (
        <Navbar Links={ Links } active ={ active} home='/estudante' />
    )
}

export default StudentNavbar;