import { useCallback, useRef, useState } from "react";
import UniversityNavbar from "../../../components/UniversityNavbar";
import RecordComponent from '../../../components/RecordComponent';
import { toPng } from 'html-to-image';
import { useMoralisFile, useMoralisQuery, useNewMoralisObject } from "react-moralis";
import { useAppContext } from "../../../context/ContractContext";


export default function Adicionar() {

    const [newStudent, setNewStudent] = useState({
        registration: '',
        name: '',
        documentId: '',
        course: '',
        cpf: '',
        curriculum: '',
        birth: '',
        city: '',
        state: '',
        country: '',
        subjects: [],
        wallet: ''
    });

    const [birthValue, setBirthValue] = useState('');

    const { saveFile } = useMoralisFile();

    const { save } = useNewMoralisObject("AddressToName");

    const {UploadNFTMetadaNewStudent} = useAppContext()

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setNewStudent(
            {
                ...newStudent,
                [name]: value
            }
        );

    }

    const handleBirthChange = (e) => {
        const strBirth = e.target.value;
        setBirthValue(strBirth);
        const formatedBirth = strBirth.split('-').reverse().join('-').replaceAll('-','/');
        setNewStudent({
            ...newStudent,
            birth:formatedBirth
        });

    }

    const nameQuery = useMoralisQuery(
        "AddressToName",
        (query) => query.equalTo("address", newStudent.wallet),
        [newStudent.wallet],
        { autoFetch: false }
    )

    const saveUserName = async () => {
        const response = await nameQuery.fetch()
        if(response.length===0){
            const data = {
                address: newStudent.wallet.toLowerCase(),
                name: newStudent.name
            }
            save(data);
        }

    }

    const submitStudent = async () => {
        const dataUrl = await makeRecordImage();
        const studentRecord = {...newStudent};
        delete studentRecord.wallet;
        studentRecord.image = dataUrl;
        try {
            saveUserName();
            const result = await saveFile(
            "student_nft.json",
            {base64: btoa(JSON.stringify(studentRecord))},
            {
                type: 'base64',
                saveIPFS: true,
            }
            );
            UploadNFTMetadaNewStudent(newStudent.wallet,result._ipfs);
        } catch (error) {
            console.log(error);
        }

    }

    const ref = useRef(null);

    const makeRecordImage = useCallback(async () => {
        if (ref.current === null) {
            return
        }

        const dataUrl = await toPng(ref.current, { cacheBust: true}); 

        return dataUrl;

    }, [ref])

    return (
        <>
            <UniversityNavbar active='ADICIONAR ALUNO' />
            <main className='container items-center p-5 mx-auto sm'>
                <section className='flex flex-col items-center w-full p-4 mb-5 bg-white border-t-4 border-cyan-400'>
                    <p className="text-4xl">Inicie o histórico acadêmico de um aluno</p>

                    <div className='grid w-2/3 grid-cols-3 gap-4 mt-4'>
                        <div className="col-span-3">
                            <label htmlFor="wallet" className='block mb-2 text-sm font-medium text-gray-900'>Endereço da Carteira</label>
                            <input id="wallet" name="wallet" type="text" placeholder='0x000000000' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.wallet} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="registration" className='block mb-2 text-sm font-medium text-gray-900'>Matrícula</label>
                            <input id="registration" name="registration" type="number" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.registration} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="course" className='block mb-2 text-sm font-medium text-gray-900'>Curso</label>
                            <input id="course" name="course" type="text" placeholder="Ciência da Computação" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.course} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="curriculum" className='block mb-2 text-sm font-medium text-gray-900'>Currículo</label>
                            <input id="curriculum" name="curriculum" min="1900" max="2099" step="1" type="number" placeholder="2022" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.curriculum} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="name" className='block mb-2 text-sm font-medium text-gray-900'>Nome</label>
                            <input id="name" name="name" type="text" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.name} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="documentId" className='block mb-2 text-sm font-medium text-gray-900'>Documento de identificação</label>
                            <input id="documentId" name="documentId" type="text" placeholder='1234567 SSP-PB' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.documentId} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="cpf" className='block mb-2 text-sm font-medium text-gray-900'>CPF</label>
                            <input id="cpf" name="cpf" type="text" placeholder='12345678910' className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' maxLength={11} value={newStudent.cpf} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="city" className='block mb-2 text-sm font-medium text-gray-900'>Cidade</label>
                            <input id="city" name="city" type="text" className=' w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.city} onChange={handleChange} />
                        </div>
                        <div className="flex gap-4">
                            <div className="">
                                <label htmlFor="state" className='block mb-2 text-sm font-medium text-gray-900'>Estado</label>
                                <input id="state" name="state" type="text" maxLength={2} placeholder='PB' className='bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.state} onChange={handleChange} />
                            </div>
                            <div className="">
                                <label htmlFor="country" className='block mb-2 text-sm font-medium text-gray-900'>País</label>
                                <input id="country" name="country" type="text" maxLength={2} placeholder='BR' className='bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={newStudent.country} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="w-2/3">
                            <label htmlFor="birth" className='block mb-2 text-sm font-medium text-gray-900'>Data de Nascimento</label>
                            <input id="birth" name="birth" type="date" className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' value={birthValue} onChange={handleBirthChange} />
                        </div>
                        <button type="submit" className='col-start-2 px-4 py-2 font-semibold text-blue-700 bg-transparent border border-blue-500 rounded hover:bg-blue-500 hover:text-white hover:border-transparent' onClick={submitStudent}>Cadastrar histórico</button>
                    </div>

                    <div className='h-0 overflow-hidden'>
                        <RecordComponent divRef={ref} nft_metadata={newStudent} />
                    </div>

                </section>

            </main>
        </>
    )
}