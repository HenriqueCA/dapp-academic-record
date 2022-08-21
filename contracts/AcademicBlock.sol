// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AcademicBlock is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;

    struct Subject {
        uint256 code;
        string name;
        uint256 credits;
        uint256 workload;
        bool mandatory;
        address[] enrolleds;
    }

    struct Professor {
        address wallet;
        uint256[] subjectCodes;
    }

    mapping(address => address) private professorToUniversity;
    mapping(address => Professor[]) private UniversityToProfessors;
    mapping(address => address) private studentToUniversity;
    mapping(address => Subject[]) private universityToCurriculum;

    mapping(address => uint256) private addressToTokenId;

    bytes32 public constant PROFESSOR_ROLE = keccak256("PROFESSOR_ROLE");
    bytes32 public constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");

    Counters.Counter private _tokenIdCounter;

    modifier canUpdateUri(address student, uint256 tokenId) {
        require(
            professorToUniversity[msg.sender] == studentToUniversity[student],
            "No permission to update student NFT"
        );
        require(
            ownerOf(tokenId) == student,
            "Address is not the owner of tokenID"
        );
        _;
    }

    modifier canRemoveStudent(uint256 subjectCode) {
        bool check = false;
        address university = professorToUniversity[msg.sender];
        for (uint256 i = 0; i < UniversityToProfessors[university].length; i++) {
            Professor memory p = UniversityToProfessors[university][i];
            for (uint256 j = 0; j < p.subjectCodes.length; j++) {
                if (p.subjectCodes[j] == subjectCode) {
                    check = true;
                }
            }
        }

        require(check, "No permission to remove student from subject");
        _;
    }

    constructor() ERC721("AcademicBlock", "ABR") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(UNIVERSITY_ROLE, msg.sender);
        _setRoleAdmin(PROFESSOR_ROLE, UNIVERSITY_ROLE);
    }

    function safeMint(address to, string memory uri)
        public
        onlyRole(UNIVERSITY_ROLE)
    {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        studentToUniversity[to] = msg.sender;
        addressToTokenId[to] = tokenId;
    }

    function getSubjects() public view returns (Subject[] memory) {
        if (hasRole(UNIVERSITY_ROLE, msg.sender)) {
            return universityToCurriculum[msg.sender];
        } else if (hasRole(PROFESSOR_ROLE, msg.sender)) {
            return universityToCurriculum[professorToUniversity[msg.sender]];
        } else {
            return universityToCurriculum[studentToUniversity[msg.sender]];
        }
    }

    function getProfessors() public view returns (Professor[] memory) {
        require(
            hasRole(UNIVERSITY_ROLE, msg.sender) ||
                hasRole(PROFESSOR_ROLE, msg.sender)
        );
        if (hasRole(UNIVERSITY_ROLE, msg.sender)) {
            return UniversityToProfessors[msg.sender];
        } else {
            return UniversityToProfessors[professorToUniversity[msg.sender]];
        }
    }

    function enrollStudent(uint256[] memory subjectCodes) public {
        address university = studentToUniversity[msg.sender];

        Subject[] storage currSubjects = universityToCurriculum[university];

        for (uint256 i = 0; i < currSubjects.length; i++) {
            for (uint256 j = 0; j < subjectCodes.length; j++) {
                if (currSubjects[i].code == subjectCodes[j]) {
                    currSubjects[i].enrolleds.push(msg.sender);
                }
            }
        }
    }


    function updateStudentToUniversity(address student, address newUniversity)
        public
        onlyRole(UNIVERSITY_ROLE)
    {
        require(studentToUniversity[student] == msg.sender); // Only active university can send ownership to other university.
        studentToUniversity[student] = newUniversity;
    }

    function saveProfessors(Professor[] memory profs)
        public
        onlyRole(UNIVERSITY_ROLE)
    {
        delete UniversityToProfessors[msg.sender];
        for (uint256 i = 0; i < profs.length; i++) {
            UniversityToProfessors[msg.sender].push(profs[i]);
            _grantRole(PROFESSOR_ROLE, profs[i].wallet);
            professorToUniversity[profs[i].wallet] = msg.sender;
        }
    }

    function createCurriculum(Subject[] memory subs)
        public
        onlyRole(UNIVERSITY_ROLE)
    {
        delete universityToCurriculum[msg.sender];
        for (uint256 i = 0; i < subs.length; i++) {
            universityToCurriculum[msg.sender].push(subs[i]);
        }
    }

    function _removeEnrolledStudentsFromSubject(uint256 subjectCode)
        private
        onlyRole(PROFESSOR_ROLE)
    {
        address university = professorToUniversity[msg.sender];
        Subject[] storage subs = universityToCurriculum[university];

        uint256 index;

        for (uint256 i = 0; i < subs.length; i++) {
            if (subjectCode == subs[i].code) {
                index = i;
            }
        }

        delete subs[index].enrolleds;
    }

    function updateNFTUris(
        address[] memory students,
        string[] memory uris,
        uint256 subjectCode
    ) public onlyRole(PROFESSOR_ROLE) {
        for (uint256 i = 0; i < students.length; i++) {
            _setTokenURI(addressToTokenId[students[i]], uris[i]);   
        }
        _removeEnrolledStudentsFromSubject(subjectCode);
    }



    function getRole() public view returns (string memory) {
        if (hasRole(UNIVERSITY_ROLE, msg.sender)) {
            return "University";            
        } else if (hasRole(PROFESSOR_ROLE, msg.sender)) {
            return "Professor";
        }
        else {
            return "Student";
        }
    }

    function getNFT(address account) public view returns (string memory) {
        uint256 tokenId = addressToTokenId[account];
        return tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
