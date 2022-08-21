import UniversityNavbar from '../../components/UniversityNavbar'
import { IoChevronDownOutline, IoRemoveCircle } from 'react-icons/io5'
import { useState } from 'react';
import { useAppContext } from '../../context/ContractContext';


const SubjectComponent = ({ code, removeSubject }) => {

    const { allSubjects } = useAppContext();

    const subject = allSubjects.filter(sub => { return sub.code === code })[0];

    return (
        <div className='flex items-center px-2 py-1 bg-gray-300 border-b-2'>
            <p className='flex-1 text-md'>{subject ? subject.name : ""}</p>
            <button>
                < IoRemoveCircle className='text-2xl hover:fill-red-500 fill-red-700' onClick={() => removeSubject(code)} />
            </button>
        </div>
    )
}

const ProfessorComponent = ({  professor }) => {

    const {name, wallet, subjectCodes} = professor;

    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownValue, setDropdownValue] = useState('Adicione uma disciplina');

    const { allSubjects, allProfessors, setAllProfessors } = useAppContext();

    const filteredSubjects = allSubjects.filter(sub => {
        return !subjectCodes.includes(sub.code)
    })

    const addSubject = () => {

        const subject = filteredSubjects.filter(sub => { return sub.name === dropdownValue })[0];

        if(subject) {
            professor.subjectCodes.push(subject.code);
            setAllProfessors([...allProfessors]);
            setDropdownValue('');
        }

    }

    const removeSubject = (code) => {

        professor.subjectCodes = professor.subjectCodes.filter(sub => {return sub != code});
        setAllProfessors([...allProfessors]);

    }



    return (
        <div className='bg-gray-100'>
            <button className='flex items-center w-full px-4 py-2 text-left border hover:bg-teal-300' onClick={() => setOpen(!open)}>
                <p className='flex-1 text-xl truncate'>{name ? name : wallet}</p>
                < IoChevronDownOutline className={`text-xl ${open ? '' : 'rotate-180'} transition-all duration-100 ease-in`} />
            </button>
            <div className={`${open ? '' : 'hidden'} mb-2`} >
                {subjectCodes.map((code) => { return <SubjectComponent key={code} code={code} removeSubject={removeSubject} /> })}
                <div className='flex items-center justify-center gap-2 bg-gray-300'>
                    <div className='relative w-2/5 py-2' onClick={() => { setDropdownOpen(!dropdownOpen) }}>
                        <button className='flex items-center w-full gap-2 p-1 bg-white border border-cyan-300' >
                            <p className='flex-1'>{dropdownValue ? dropdownValue : 'Adicione uma disciplina'}</p>
                            < IoChevronDownOutline />
                        </button>

                        <div className={` ${dropdownOpen ? '' : 'hidden'} absolute bg-cyan-100 z-10 w-full flex flex-col`}>
                            {filteredSubjects && filteredSubjects.map((item) => {
                                return <button key={item.code} className='border border-white hover:bg-cyan-600' onClick={() => setDropdownValue(item.name)}>{item.name}</button>
                            })}
                        </div>
                    </div>
                    <button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={addSubject}>Adicionar disciplina</button>
                </div>

            </div>

        </div>
    )

};

export default function Professors() {

    const [open, setOpen] = useState(true);
    const [newProfessor, setNewProfessor] = useState(
        {
            name: '',
            wallet: '',
            subjectCodes: []
        }
    )

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const [dropdownValue, setDropdownValue] = useState('Selecione a disciplina');

    const { allProfessors, setAllProfessors, saveProfessors, allSubjects } = useAppContext();

    const handleChange = (e) => {
        setNewProfessor({
            ...newProfessor,
            [e.target.name]: e.target.value
        });
    }

    const handleDropdown = (sub) => {
        setNewProfessor({ ...newProfessor, subjectCodes: [sub.code] });
        setDropdownValue(sub.name);
    }

    const addButton = () => {
        setAllProfessors([
            ...allProfessors, newProfessor
        ])
    }

    return (
        <>
            <UniversityNavbar active='PROFESSORES' />

            <main className='container flex flex-col items-center p-5 mx-auto sm gap-10'>
                <section className='flex justify-center w-full p-4 bg-white border-t-4 border-cyan-400'>
                    <div className='w-full'>
                        <p className='pb-2 mb-4 text-4xl text-center border-b-2'>Adicione um professor</p>
                        <div className='flex justify-center '>
                            <div className='grid items-end w-2/3 grid-cols-4 grid-rows-3 gap-x-2 '>
                                <div className='w-full col-span-2'>
                                    <label htmlFor="name" className='block mb-2 text-sm font-medium text-gray-900'>Nome</label>
                                    <input id="name" name="name" type="text" placeholder='' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newProfessor.name} onChange={handleChange} />
                                </div>
                                <div className='w-full col-span-2'>
                                    <label htmlFor="wallet" className='block mb-2 text-sm font-medium text-gray-900'>Endereço da carteira</label>
                                    <input id="wallet" name="wallet" type="text" placeholder='0x000000000' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newProfessor.wallet} onChange={handleChange} />
                                </div>
                                <div className='flex items-center justify-center col-span-2 col-start-2 gap-2'>
                                    <div className='relative w-full py-2' onClick={() => { setDropdownOpen(!dropdownOpen) }}>
                                        <button className='flex items-center w-full gap-2 p-1 bg-white border border-cyan-300' >
                                            <p className='flex-1'>{dropdownValue}</p>
                                            < IoChevronDownOutline />
                                        </button>

                                        <div className={` ${dropdownOpen ? '' : 'hidden'} absolute bg-cyan-100 z-10 w-full flex flex-col`}>
                                            {allSubjects && allSubjects.map((item) => {
                                                return <button key={item.code} className='border border-white hover:bg-cyan-600' onClick={() => handleDropdown(item)}>{item.name}</button>
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <button className='col-span-2 col-start-2 px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={addButton}>Adicionar</button>

                            </div>
                        </div>
                    </div>
                </section>

                <section className='w-full border-t-4 border-cyan-400'>
                    <button className='flex items-center w-full px-4 py-2 bg-white' onClick={() => setOpen(!open)}>
                        <p className='flex-1 text-4xl '>Professores vinculados à sua universidade</p>
                        <IoChevronDownOutline className={`text-3xl ${open ? '' : 'rotate-180'} transition-all duration-100 ease-in`} />
                    </button>
                    <div className={`${open ? '' : 'hidden'}`}>
                        {allProfessors.map((professor) => {
                            return <ProfessorComponent key={professor.wallet}professor={professor} />
                        })}

                    </div>
                </section>

                <div className='w-full border bg-white'>

                    <button className='col-span-2 col-start-2 px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent w-full' onClick={saveProfessors}>Salvar professores</button>

                </div>

            </main>

            <footer>
            </footer>
        </>
    )
}