
// const NFTMetadata_const = {
//     registration: 117111910,
//     name: 'Henrique Castro Arriel',
//     documentId: '3434421 SSP-PB',
//     course: 'Ciência da Computação - D (14102100)',
//     cpf: '09332487413',
//     curriculum: '2017',
//     birth: '31/12/1998',
//     city: 'Campina Grande',
//     state: 'PB',
//     country: 'BR',
//     subjects: [
//         {
//             code: 1411174,
//             name: 'Introdução a computação',
//             professorName: 'Eanes Torres Pereira',
//             mandatory: true,
//             credits: 4,
//             workload: 60,
//             grade: 9.1,
//             situation: 'Aprovado',
//             term: '2017.1'
//         },
//     ]
// }
const Subject = ({ data }) => {
    const { code, name, credits, workload, mandatory, grade, term } = data;

    return (
        <tr className='text-center'>
            <td className='border-2 border-cyan-700'>{code}</td>
            <td className='border-2 border-cyan-700'><p>{name}</p></td>
            <td className='border-2 border-cyan-700'>{mandatory ? 'Obrigatória' : 'Optativa'}</td>
            <td className='border-2 border-cyan-700'>{credits}</td>
            <td className='border-2 border-cyan-700'>{workload}</td>
            <td className='border-2 border-cyan-700'>{grade}</td>
            <td className='border-2 border-cyan-700'>{grade >= 5 ? 'Aprovado' : 'Reprovado'}</td>
            <td className='border-2 border-cyan-700'>{term}</td>
        </tr>
    )
}

export default function RecordComponent({ divRef, NFTMetadata }) {
    if (NFTMetadata) {
        return (
            <div className='container flex flex-col items-center p-5 mx-auto sm' ref={divRef}>
                <section className='flex flex-col justify-center w-full p-4 mb-4 bg-white border-t-4 border-cyan-400'>
                    <p className='mb-2 text-4xl border-b-4'>Identificação do aluno</p>
                    <div className='grid grid-cols-2 grid-rows-3'>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Aluno:</p>
                            <p>{NFTMetadata.registration} {NFTMetadata.name}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Documento de Identificação:</p>
                            <p>{NFTMetadata.documentId}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Curso:</p>
                            <p>{NFTMetadata.course}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p className='font-bold'>CPF:</p>
                            <p>{NFTMetadata.cpf}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Nascimento:</p>
                            <p>{NFTMetadata.birth} - {NFTMetadata.city}-{NFTMetadata.state} - {NFTMetadata.country}</p>
                        </div>
                        <div className='flex gap-2'>
                            <p className='font-bold'>Curriculo:</p>
                            <p>{NFTMetadata.curriculum}</p>
                        </div>
                    </div>

                </section>

                <section className='flex flex-col justify-center w-full p-4 mb-4 bg-white border-t-4 border-cyan-400'>
                    <p className='mb-2 text-4xl border-b-4'>Disciplinas</p>
                    <table className='w-full border border-collapse border-cyan-500 '>
                        <thead>
                            <tr>
                                <th className='border-2 border-cyan-600 bg-slate-400 '>Código</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Nome</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Tipo</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Créditos</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Carga horária</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Média</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Situação</th>
                                <th className='border-2 border-cyan-600 bg-slate-400'>Período</th>
                            </tr>
                        </thead>
                        <tbody>
                            {NFTMetadata.subjects ? NFTMetadata.subjects.map((subject) => { return <Subject key={subject.code} data={subject} /> }) : undefined}
                        </tbody>
                    </table>
                </section>

            </div>
        )
    }

}