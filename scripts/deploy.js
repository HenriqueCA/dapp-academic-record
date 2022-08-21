// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { keccak256, toUtf8Bytes } = require("ethers/lib/utils");

const UNIVERSITY_ROLE = keccak256(toUtf8Bytes('UNIVERSITY_ROLE'));

async function main() {

  const [_, otherUniversity] = await ethers.getSigners();

  const AcademicBlock = await hre.ethers.getContractFactory("AcademicBlock");
  const academicBlock = await AcademicBlock.deploy();

  await academicBlock.deployed();


  console.log('Contract deployed to: ', academicBlock.address );



  academicBlock.grantRole(UNIVERSITY_ROLE, otherUniversity.address)

  console.log("The owner and the following address is a university:", otherUniversity.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
