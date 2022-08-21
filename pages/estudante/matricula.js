
import { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import StudentNavbar from '../../components/StudentNavbar'
import { useAppContext } from '../../context/ContractContext';


const Subject = ({ data, addCode, removeCode }) => {
    const { code, name, credits, workload, mandatory } = data;

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (checked) {
            addCode(code);
        } else {
            removeCode(code);
        }
    }, [checked])


    return (
        <tr className='text-center'>
            <td className='border-2 border-cyan-700'>{code}</td>
            <td className='border-2 border-cyan-700'>{name}</td>
            <td className='border-2 border-cyan-700'>{mandatory ? 'Obrigatória' : 'Optativa'}</td>
            <td className='border-2 border-cyan-700'>{credits}</td>
            <td className='border-2 border-cyan-700'>{workload}</td>
            <td className='border-2 border-cyan-700 hover:cursor-pointer' onClick={() => setChecked(!checked)}><input type='checkbox' checked={checked} readOnly ></input></td>
        </tr>
    )

}

export default function Matricula() {

    const [subjectsCodes, setSubjectsCodes] = useState([]);

    const [filteredSubjects, setFilteredSubjects] = useState([]);

    const { allSubjects, enrollStudent } = useAppContext();

    const addSubjectCode = (code) => {
        setSubjectsCodes([
            ...subjectsCodes,
            code
        ])
    }

    const removeSubjectCode = (code) => {
        setSubjectsCodes(
            subjectsCodes.filter(c => c !== code)
        );
    }


    const enroll = () => {
        if(subjectsCodes.length > 0) {
            enrollStudent(subjectsCodes);
            setFilteredSubjects(filteredSubjects.filter((subject) => { return !subjectsCodes.includes(subject.code) }))
        }
    }

    useEffect(() => {
        if (allSubjects) {
            const filt_subjects = allSubjects.filter((subject) => {
                return (!subject.enrolleds.some(e => { return e.toLowerCase() === account }))
            })
            setFilteredSubjects(filt_subjects);
        }

    }, [allSubjects])

    const { account } = useMoralis();

    return (
        <>
            <StudentNavbar active="MATRICULA" />
            <main className='container flex flex-col items-center p-5 mx-auto sm'>
                <section className='flex justify-center w-full p-4 mb-5 bg-white border-t-4 border-cyan-400'>
                    {filteredSubjects.length === 0 ? <p className='text-4xl'>Não há disciplinas para matricula</p> :
                        <div className='flex flex-col w-full gap-20'>
                            <table className='w-full border border-collapse border-cyan-500 '>
                                <thead>
                                    <tr>
                                        <th className='border-2 border-cyan-600 bg-slate-400 '>Código</th>
                                        <th className='border-2 border-cyan-600 bg-slate-400'>Nome</th>
                                        <th className='border-2 border-cyan-600 bg-slate-400'>Tipo</th>
                                        <th className='border-2 border-cyan-600 bg-slate-400'>Créditos</th>
                                        <th className='border-2 border-cyan-600 bg-slate-400'>Carga horária</th>
                                        <th className='border-2 border-cyan-600 bg-slate-400'>Matricular</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSubjects.map((subject) => {
                                        return <Subject key={subject.code} data={subject} addCode={addSubjectCode} removeCode={removeSubjectCode} />
                                    })}
                                </tbody>
                            </table>

                            <button className='px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={enroll} >Matricular-se nas disciplinas</button>
                        </div>
                    }
                </section>

            </main>
        </>
    )
}