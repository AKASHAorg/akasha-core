pragma solidity ^0.8.0;
import "./AbstractIntegrationRegistry.sol";

contract IntegrationRegistry is AbstractIntegrationRegistry {

    enum IntegrationType { Application, Plugin, Widget }

    event IntegrationPublished(bytes32 integrationId, string integrationName);
    event IntegrationVersionPublished(bytes32 releaseId, bytes32 integrationId);

    struct Integration {
        string version;
        uint createdAt;
        bytes32 integrationId;
        IntegrationType integrationType;
        // base-16 CID hash
        bytes32 manifestHash;
    }

    struct IntegrationInfo {
        bool enabled;
        string name;
        address author;
        bytes32[] releaseIds;
        bytes32 latestReleaseId;
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
        releases[releaseId].integrationType = _integrationType;
        releases[releaseId].manifestHash = _manifestHash;

        if(integrationInfo[integrationId].enabled){
            bytes32 latestRelease = integrationInfo[integrationId].latestReleaseId;
            integrationInfo[integrationId].releaseIds.push(latestRelease);
            emit IntegrationVersionPublished(releaseId, integrationId);
        } else {
            integrationInfo[integrationId].enabled = true;
            integrationInfo[integrationId].name = _name;
            integrationInfo[integrationId].author = msg.sender;
            releases[releaseId].integrationId = integrationId;
            integrationIdsList.push(integrationId);
            emit IntegrationPublished(integrationId, _name);
        }
        integrationInfo[integrationId].latestReleaseId = releaseId;
    }


    function getAllPackageIds(uint offset, uint limit)
    public
    view
    override
    returns (
        bytes32[] memory packageIds,
        uint pointer
    )
    {
        pointer = offset + limit;
        if(pointer >= integrationIdsList.length){
            pointer = integrationIdsList.length;
        }

        for(uint i=offset; i< pointer; i++){
            packageIds[i] = integrationIdsList[i];
        }
        return(packageIds, pointer);
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

    function getAllReleaseIds(string memory integrationName, uint offset, uint limit)
    public
    view
    override
    returns (
        bytes32[] memory integrationIds,
        uint pointer
    ){
        bytes32 integrationId = generateIntegrationId(integrationName);
        pointer = offset + limit;
        if(pointer >= integrationInfo[integrationId].releaseIds.length){
            pointer = integrationInfo[integrationId].releaseIds.length;
        }

        for(uint i=offset; i< pointer; i++){
            integrationIds[i] = integrationInfo[integrationId].releaseIds[i];
        }
        return(integrationIds, pointer);
    }


    function getReleaseData(bytes32 releaseId)
    public
    view
    override
    returns (
        string memory integrationName,
        string memory version,
        bytes32 manifestHash
    ){
        integrationName = integrationInfo[releases[releaseId].integrationId].name;
        version = releases[releaseId].version;
        manifestHash = releases[releaseId].manifestHash;
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
        bytes32 latestReleaseId
){
        integrationName = integrationInfo[integrationId].name;
        author = integrationInfo[integrationId].author;
        enabled = integrationInfo[integrationId].enabled;
        latestReleaseId = integrationInfo[integrationId].latestReleaseId;
    }
}
