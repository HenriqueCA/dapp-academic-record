import { useState } from 'react';
import { IoClose } from 'react-icons/io5'
import UniversityNavbar from '../../components/UniversityNavbar'
import { useAppContext } from '../../context/ContractContext';

const Subject = ({ data, remove }) => {
    const { code, name, credits, workload, mandatory } = data;

    return (
        <tr className='text-center'>
            <td className='border-2 border-cyan-700'>{code}</td>
            <td className='border-2 border-cyan-700'>{name}</td>
            <td className='border-2 border-cyan-700'>{mandatory ? 'Obrigatória' : 'Optativa'}</td>
            <td className='border-2 border-cyan-700'>{credits}</td>
            <td className='border-2 border-cyan-700'>{workload}</td>
            <td className='transition-all duration-500 border-2 border-cyan-700 hover:cursor-pointer hover:bg-red-300' onClick={() => remove(code)}><div className='flex justify-center'><IoClose className='text-xl fill-red-700' /> </div></td>
        </tr>
    )
}

export default function Disciplinas() {
    const [newSubject, setNewSubject] = useState({
        code: '',
        name: '',
        credits: '',
        workload: '',
        mandatory: true,
        enrolleds: []
    });

    const {allSubjects, setAllSubjects, saveSubjects} = useAppContext();


    const handleChange = (e) => {
        const name = e.target.name;
        let value;
        if (name === "mandatory") {
            value = e.target.checked;
        } else if (name === "code" || name === "workload" || name === "credits") {
            value = Number(e.target.value);
        }
        else {
            value = e.target.value;
        }

        setNewSubject(
            {
                ...newSubject,
                [name]: value
            }
        );

    }

    const addSubject = () => {
        if ( newSubject.code in allSubjects) {
            alert("Já existe uma disciplina com esse código.")
        } else {
            setAllSubjects([...allSubjects, newSubject]);
        }
    }

    const removeSubject = (code) => {
        setAllSubjects(
            allSubjects.filter(s => s.code !== code)
        );
    }

    return (
        <>
            <UniversityNavbar active="DISCIPLINAS" />
            <main className='container flex flex-col items-center p-5 mx-auto sm'>
                <section className='flex flex-col items-center w-full p-4 bg-white border-t-4 border-cyan-400'>
                    <p className='text-4xl'>
                        Adicione disciplinas ao curso
                    </p>
                    <div className='flex items-end justify-between w-full gap-4 pb-2 m-4 border-b-2 '>
                        <div className='w-32'>
                            <label htmlFor="code" className='block mb-2 text-sm font-medium text-gray-900'>Código</label>
                            <input id="code" name="code" type="number" placeholder={12345} min={0} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newSubject.code} onChange={handleChange} />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="name" className='block mb-2 text-sm font-medium text-gray-900'>Nome</label>
                            <input id="name" name="name" type="text" placeholder='Nome da disciplina' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newSubject.name} onChange={handleChange} />
                        </div>
                        <div className='flex flex-col items-center w-14'>
                            <label htmlFor="credits" className='block mb-2 text-sm font-medium text-gray-900'>Créditos</label>
                            <input id="credits" name="credits" type="text" placeholder={4} maxLength={1} className='text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newSubject.credits} onChange={handleChange} />
                        </div>
                        <div className='flex flex-col items-center w-20 whitespace-nowrap '>
                            <label htmlFor="workload" className='block mb-2 text-sm font-medium text-gray-900 '>Carga horária</label>
                            <input id="workload" name="workload" type="text" placeholder={60} maxLength={3} className='bg-gray-50 text-center border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ' value={newSubject.workload} onChange={handleChange} />
                        </div>
                        <div className='flex flex-col self-start'>
                            <label htmlFor="mandatory" className='block mb-4 text-sm font-medium text-gray-900'>Obrigatória</label>
                            <input id="mandatory" name="mandatory" type="checkbox" className='h-5 mt-1' checked={newSubject.mandatory} onChange={handleChange} />
                        </div>

                        <button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded mt-7 hover:bg-blue-500 hover:text-white hover:border-transparent h-1/2' onClick={addSubject}>Adicionar</button>
                    </div>

                    {allSubjects && (allSubjects.length === 0 ? undefined : <div className='flex flex-col w-full gap-20'>
                        <table className='w-full border border-collapse border-cyan-500 '>
                            <thead>
                                <tr>
                                    <th className='border-2 border-cyan-600 bg-slate-400 '>Código</th>
                                    <th className='border-2 border-cyan-600 bg-slate-400'>Nome</th>
                                    <th className='border-2 border-cyan-600 bg-slate-400'>Tipo</th>
                                    <th className='border-2 border-cyan-600 bg-slate-400'>Créditos</th>
                                    <th className='border-2 border-cyan-600 bg-slate-400'>Carga horária</th>
                                    <th className='border-2 border-cyan-600 bg-slate-400'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allSubjects.map((subject) => { return <Subject key={subject.code} data={subject} remove={removeSubject} /> })}
                            </tbody>
                        </table>


                        <button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={saveSubjects}>Salvar disciplinas</button>
                    </div>)
                    }

                </section>

            </main>
        </>

    )
}