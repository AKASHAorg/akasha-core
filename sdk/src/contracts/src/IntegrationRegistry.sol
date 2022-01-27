pragma solidity ^0.8.0;
import "./AbstractIntegrationRegistry.sol";

contract IntegrationRegistry is AbstractIntegrationRegistry {

    event IntegrationPublished(bytes32 integrationId, string integrationName);
    event IntegrationVersionPublished(bytes32 releaseId, bytes32 integrationId);

    struct Integration {
        string version;
        uint createdAt;
        bytes32 integrationId;
        // base-16 CID hash
        bytes32 manifestHash;
    }

    struct IntegrationInfo {
        bool enabled;
        string name;
        address author;
        bytes32[] releaseIds;
        bytes32 latestReleaseId;
        IntegrationType integrationType;
    }

    // releaseId => integration
    mapping(bytes32 => Integration) releases;
    // integrationId => integrationInfo
    mapping(bytes32 => IntegrationInfo) integrationInfo;
    // all integrations available
    bytes32[] integrationIdsList;

    function generateReleaseId(string memory _integrationName, string memory _version)
    public
    view
    override
    returns (bytes32 releaseId)
    {
        return keccak256(abi.encodePacked(_integrationName, _version));
    }

    function generateIntegrationId(string memory name)
    public
    pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(name));
    }


    function release(
        string memory _name,
        string memory _version,
        bytes32 _manifestHash,
        IntegrationType _integrationType
    ) public onlyOwner {
        bytes32 integrationId = generateIntegrationId(_name);
        bytes32 releaseId = generateReleaseId(_name, _version);
        releases[releaseId].createdAt = block.timestamp;
        releases[releaseId].version = _version;
        releases[releaseId].manifestHash = _manifestHash;

        if(integrationInfo[integrationId].enabled){
            bytes32 latestRelease = integrationInfo[integrationId].latestReleaseId;
            integrationInfo[integrationId].releaseIds.push(latestRelease);
            emit IntegrationVersionPublished(releaseId, integrationId);
        } else {
            integrationInfo[integrationId].enabled = true;
            integrationInfo[integrationId].integrationType = _integrationType;
            integrationInfo[integrationId].name = _name;
            integrationInfo[integrationId].author = msg.sender;
            releases[releaseId].integrationId = integrationId;
            integrationIdsList.push(integrationId);
            emit IntegrationPublished(integrationId, _name);
        }
        integrationInfo[integrationId].latestReleaseId = releaseId;
    }


    function getAllPackageIds(uint offset)
    public
    view
    override
    returns (
        bytes32[16] memory integrationIds,
        uint next
    )
    {
        uint _pointer = offset + uint(16);
        if(_pointer >= integrationIdsList.length){
            _pointer = integrationIdsList.length;
            next = 0;
        } else {
            next = _pointer;
        }

        uint ii = 0;
        for(uint i=offset; i< _pointer; i++){
            integrationIds[ii] = integrationIdsList[i];
            ii++;
        }
        return(integrationIds, next);
    }

    function getPackageName(bytes32 integrationId)
    public
    view
    override
    returns (string memory integrationName){
        return(integrationInfo[integrationId].name);
    }

    function getReleaseId(string memory integrationName, string memory version)
    public
    view
    override
    returns (bytes32 releaseId){
        return generateReleaseId(integrationName, version);
    }

    function getAllReleaseIds(string memory integrationName, uint offset)
    public
    view
    override
    returns (
        bytes32[16] memory releaseIds,
        uint next
    ){
        bytes32 integrationId = generateIntegrationId(integrationName);
        uint _pointer = offset + uint(16);
        if(_pointer >= integrationInfo[integrationId].releaseIds.length){
            _pointer = integrationInfo[integrationId].releaseIds.length;
            next = 0;
        } else {
            next = _pointer;
        }
        uint ii = 0;
        for(uint i=offset; i< _pointer; i++){
            releaseIds[ii] = integrationInfo[integrationId].releaseIds[i];
            ii++;
        }
        return(releaseIds, next);
    }


    function getReleaseData(bytes32 releaseId)
    public
    view
    override
    returns (
        string memory integrationName,
        string memory version,
        bytes32 manifestHash,
        IntegrationType integrationType
    ){
        integrationName = integrationInfo[releases[releaseId].integrationId].name;
        version = releases[releaseId].version;
        manifestHash = releases[releaseId].manifestHash;
        integrationType = integrationInfo[releases[releaseId].integrationId].integrationType;
    }

    //@dev returns the total number of integrations available on the registry
    function numPackageIds()
    public
    view
    override
    returns (uint totalCount){
        return integrationIdsList.length;
    }

    //@dev returns the total number of releases for a specific integration *name*
    function numReleaseIds(string memory integrationName)
    public
    view
    override
    returns (uint totalCount){
        bytes32 integrationId = generateIntegrationId(integrationName);
        if(integrationInfo[integrationId].enabled) {
            return integrationInfo[integrationId].releaseIds.length + 1;
        }
        return uint(0);
    }

    function getPackageInfo(bytes32 integrationId)
    public
    view
    returns(
        string memory integrationName,
        address author,
        bool enabled,
        bytes32 latestReleaseId,
        IntegrationType integrationType
){
        integrationName = integrationInfo[integrationId].name;
        author = integrationInfo[integrationId].author;
        enabled = integrationInfo[integrationId].enabled;
        latestReleaseId = integrationInfo[integrationId].latestReleaseId;
        integrationType = integrationInfo[integrationId].integrationType;
    }
}
