import UniversityNavbar from '../../../components/UniversityNavbar';
import {IoArrowDown} from 'react-icons/io5';
import { useState } from 'react';
import { useAppContext } from '../../../context/ContractContext';


export default function Transferir() {

    const [studentWallet, setStudentWallet] = useState('');
    const [newUniversityWallet, setNewUniversityWallet] = useState('');

    const {transferStudentToOtherUniversity} = useAppContext();

    const makeTransfer = () => {
        transferStudentToOtherUniversity(studentWallet, newUniversityWallet );
    }

    return (
        <>
            <UniversityNavbar active='TRANSFERIR ALUNO' />
            <main className='container items-center p-5 mx-auto sm'>
                <section className='flex flex-col items-center gap-4 p-4 mb-5 bg-white border-t-4 border-cyan-400'>
                    <p className='text-4xl'>Realize a transferência de universidade de um aluno</p>
                    <div className='w-1/3'>
                        <label htmlFor="studentWallet" className='block mb-2 text-sm font-medium text-gray-900'>Endereço da carteira do aluno</label>
                        <input id="studentWallet" name="studentWallet" type="text" placeholder='0x000000000' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={studentWallet} onChange={(e) => setStudentWallet(e.target.value)} />
                    </div>
                    <IoArrowDown className='text-4xl' />
                    <div className='w-1/3'>
                        <label htmlFor="universityWallet" className='block mb-2 text-sm font-medium text-gray-900'>Endereço da carteira da nova instituição</label>
                        <input id="universityWallet" name="universityWallet" type="text" placeholder='0x000000000' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newUniversityWallet} onChange={(e) => setNewUniversityWallet(e.target.value)} />
                    </div>

                    <button type="submit" className='col-start-2 px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={makeTransfer}>Realizar transferencia</button>
                </section>
            </main>
        </>
    )
}