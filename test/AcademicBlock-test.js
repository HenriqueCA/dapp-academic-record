const { expect } = require("chai");
const { keccak256, toUtf8Bytes } = require("ethers/lib/utils");


describe("AcademicBlock", function () {

  const DEFAULT_ADMIN_ROLE = keccak256(toUtf8Bytes('DEFAULT_ADMIN_ROLE'));

  const UNIVERSITY_ROLE = keccak256(toUtf8Bytes('UNIVERSITY_ROLE'));

  const PROFESSOR_ROLE = keccak256(toUtf8Bytes('PROFESSOR_ROLE'));

  const subjects = [
    {
      code: 12345,
      name: 'Laboratorio de Programacao 2',
      credits: 4,
      workload: 60,
      mandatory: true,
      enrolleds: []
    },
    {
      code: 1234,
      name: 'Laboratorio de Programacao 1',
      credits: 4,
      workload: 60,
      mandatory: true,
      enrolleds: []
    }
  ];


  it("Should set the right owner", async function () {
    const [owner] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    const isOwner = await block.hasRole(DEFAULT_ADMIN_ROLE, owner.address)

    expect(isOwner);
  });

  it("Should set university role", async function () {
    const [owner, otherAccount] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    const ownerUniversityRole = await block.hasRole(UNIVERSITY_ROLE, owner.address);

    await block.grantRole(UNIVERSITY_ROLE, otherAccount.address);

    const otherAccountUniversityRole = await block.hasRole(UNIVERSITY_ROLE, otherAccount.address);

    expect(ownerUniversityRole && otherAccountUniversityRole );
  });



  it("Should create a curriculum", async function () {
    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

  });

  it("Should update a curriculum", async function () {
    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    const new_subjects = [
      subjects[0]
    ];

    await block.createCurriculum(new_subjects);

  });

  it("Should map professor to university", async function () {
    const [_, professorAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.mapProfessorToUniversity(professorAdd.address);

    const professorRole = await block.hasRole(PROFESSOR_ROLE, professorAdd.address);

    expect(professorRole);

  });

  it("Should map professor to subject", async function () {
    const [_, professorAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.mapProfessorToUniversity(professorAdd.address);

    await block.mapProfessorToSubject(professorAdd.address, [12345, 1234]);
    
  });

  it("Should return professor subjects", async function () {
    const [_, professorAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.mapProfessorToUniversity(professorAdd.address);

    await block.mapProfessorToSubject(professorAdd.address, [12345, 1234]);

    const professorSubs = await block.connect(professorAdd).getProfessorSubjects();

    expect(professorSubs.length === 2);

  });

  
  it("Should remove one professor subject", async function () {
    const [_, professorAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.mapProfessorToUniversity(professorAdd.address);

    await block.mapProfessorToSubject(professorAdd.address, [12345, 1234]);

    await block.removeSubjectFromProfessor(professorAdd.address, 12345);

    const professorSubs = await block.connect(professorAdd).getProfessorSubjects();

    expect(professorSubs.length === 1);

  });

  it("Should return all subjects (student role)", async function () {
    const [_, studentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.safeMint(studentAdd.address, "Testando");

    const allSubs = await block.connect(studentAdd.address).getSubjects();

    expect(allSubs.length === 2);

  });

  it("Should return all subjects (university role)", async function () {

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    const allSubs = await block.getSubjects();

    expect(allSubs.length === 2);

  });

  it("Should enroll student and update enrolled array on subject", async function () {
    const [_, studentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.safeMint(studentAdd.address, "Testando");

    await block.connect(studentAdd).enrollStudent([1234]);

    const allSubs = await block.connect(studentAdd.address).getSubjects();

    expect(allSubs[1].enrolleds.length === 1);

  });

  it("Should enroll multiple students and update enrolled array on subject", async function () {
    const [_, studentAdd, anotherStudentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.safeMint(studentAdd.address, "Testando");

    await block.connect(studentAdd).enrollStudent([1234]);

    await block.safeMint(anotherStudentAdd.address, "Testando2");

    await block.connect(anotherStudentAdd).enrollStudent([1234, 12345]);

    const allSubs = await block.connect(studentAdd.address).getSubjects();

    expect(allSubs[0].enrolleds.length === 1 && allSubs[1].enrolleds.length === 2);

  });

  it("Should delete student from subject and update enrolled array", async function () {
    const [_, professorAdd, studentAdd, anotherStudentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.mapProfessorToUniversity(professorAdd.address);

    await block.mapProfessorToSubject(professorAdd.address, [12345, 1234]);

    await block.safeMint(studentAdd.address, "Testando");

    await block.connect(studentAdd).enrollStudent([1234]);

    await block.safeMint(anotherStudentAdd.address, "Testando2");

    await block.connect(anotherStudentAdd).enrollStudent([1234, 12345]);

    await block.connect(professorAdd).updateNFTURIAndRemoveFromSubject(studentAdd.address, 0, "Teste", 1234)

    const allSubs = await block.connect(studentAdd.address).getSubjects();

    expect(allSubs[0].enrolleds.length === 1 && allSubs[1].enrolleds.length === 1);

  });

  it("Should enroll multiple students and update enrolled array on professor Subject", async function () {
    const [_, professorAdd, studentAdd, anotherStudentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.mapProfessorToUniversity(professorAdd.address);

    await block.mapProfessorToSubject(professorAdd.address, [12345, 1234]);

    await block.safeMint(studentAdd.address, "Testando");

    await block.connect(studentAdd).enrollStudent([1234]);

    await block.safeMint(anotherStudentAdd.address, "Testando2");

    await block.connect(anotherStudentAdd).enrollStudent([1234, 12345]);

    const professorSubs = await block.connect(professorAdd).getProfessorSubjects();

    expect(professorSubs[0].enrolleds.length === 1 && professorSubs[1].enrolleds.length === 2);

  });

  it("Should transfer student to other university", async function () {
    const [_, studentAdd, otherUniversityAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.grantRole(UNIVERSITY_ROLE, otherUniversityAdd.address);

    await block.safeMint(studentAdd.address, "Teste");

    const subs = await block.connect(studentAdd).getSubjects();

    expect(subs.length === 2);

    await block.updateStudentToUniversity(studentAdd.address, otherUniversityAdd.address);

    const otherSubs = await block.connect(studentAdd).getSubjects();

    expect(otherSubs.length === 0);

  });

  it("Should not change enrolled students on curriculum update", async function () {
    const [_, studentAdd] = await ethers.getSigners();

    const Block = await ethers.getContractFactory("AcademicBlock");

    const block = await Block.deploy();

    await block.createCurriculum(subjects);

    await block.safeMint(studentAdd.address, "Testando");

    await block.connect(studentAdd).enrollStudent([1234]);

    const new_subjects = [
      subjects[1]
    ];
    
    await block.createCurriculum(new_subjects);
    
    const allSubs = await block.connect(studentAdd.address).getSubjects();

    expect(allSubs[0].enrolleds.length === 1);

  });

});


