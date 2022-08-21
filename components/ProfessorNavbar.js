import Navbar from './Navbar'

const ProfessorNavbar = ({ active }) => {
    const Links = [
        { name: "DISCIPLINAS", link: "/professor" },
        { name: "PERFIL", link: "/professor/perfil" },
        { name: "SAIR", link: "" }
    ];
    return (
        <Navbar Links={ Links } active ={ active} home='/professor' />
    )
}

export default ProfessorNavbar;