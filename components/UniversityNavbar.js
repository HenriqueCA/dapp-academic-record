import Navbar from './Navbar'

const UniversityNavbar = ({ active }) => {
    const Links = [
        { name: "PROFESSORES", link: "/universidade/professores" },
        { name: "DISCIPLINAS", link: "/universidade/disciplinas" },
        { name: "ADICIONAR ALUNO", link: "/universidade/aluno/adicionar" },
        { name: "TRANSFERIR ALUNO", link: "/universidade/aluno/transferir" },
        { name: "PERFIL", link: "/universidade/perfil" },
        { name: "SAIR", link: "" },
    ];
    return (
        <Navbar Links={ Links } active ={ active} home='/universidade' />
    )
}

export default UniversityNavbar;