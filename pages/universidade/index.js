import Image from 'next/image';
import Link from "next/link";
import TeacherImage from '../../public/teacher2.png';
import AddStudent from '../../public/addstudent.png';
import TransferStudent from '../../public/transfer.png';
import Profile from '../../public/profile.png';
import UniversityNavbar from '../../components/UniversityNavbar';
import Subjects from '../../public/subjects.png';

const Section = ({ name, text, link, color, img, reverse }) => {

    const chooseColor = {
        'first': ['from-white', 'to-cyan-300', 'hover:bg-cyan-300'],
        'second': ['from-green-300', 'to-white', 'hover:bg-green-300'],
        'third': ['from-white', 'to-red-300', 'hover:bg-red-300'],
        'fourth': ['from-yellow-300', 'to-white', 'hover:bg-yellow-300'],
        'fifth': ['from-white', 'to-purple-300', 'hover:bg-purple-300' ]
    }

    const sectionColor = chooseColor[color];

    let imgComponent = <div className='relative w-64'><Image src={img} layout='fill' objectFit='fill' /></div>

    return (

        <div className={`bg-gradient-to-r ${sectionColor[0]} ${sectionColor[1]} flex-1 flex`}>
            <Link href={link} > 
                <a className='flex-1' >
                    <div className={`flex flex-1 h-full shadow-lg ${sectionColor[2]} transition-all duration-500 ease-in `}>

                        {!reverse ? imgComponent : undefined}
                        <div className='flex flex-col flex-1 px-6 py-4 '>
                            <p className='mb-2 font-serif text-3xl font-bold title-font'>
                                {name}
                            </p>
                            <p className='text-2xl text-gray-700'>
                                {text}
                            </p>
                        </div>
                        {reverse ? imgComponent : undefined}
                    </div>
                </a>
            </Link>
        </div>
    )
}

export default function University() {

    return (
        <div className='flex flex-col h-screen'>
            <UniversityNavbar />

            <main className='flex flex-col flex-1'>
                <Section name='PROFESSORES' text='Vincule professores à sua universidade. Adicione e edite disciplinas que cada professor ministra.' link='/universidade/professores' color='first' img={TeacherImage} />
                <Section name='DISCIPLINAS' text='Crie as disciplinas de um curso.' link='/universidade/disciplinas' color='fifth' img={Subjects} reverse />
                <Section name='ADICIONAR ALUNO' text='Adicione um aluno à sua universidade.' link='/universidade/aluno/adicionar' color='second' img={AddStudent}  />
                <Section name='TRANSFERIR ALUNO' text='Transfira o histórico academico de um aluno para outra universidade.' link='/universidade/aluno/transferir' color='third' img={TransferStudent} reverse />
                <Section name='PERFIL' text='Visualize e edite seu perfil.' link='/universidade/perfil' color='fourth' img={Profile} />

            </main>

            <footer>
            </footer>
        </div>
    )
}