// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

abstract contract AbstractIntegrationRegistry is OwnableUpgradeable {
    enum IntegrationType { Application, Plugin, Widget }

    function getAllPackageIds(uint offset) public view virtual
    returns (
        bytes32[16] memory integrationIds,
        uint next
    );

    // Retrieves the unique string `name` associated with a package's id.
    function getPackageName(bytes32 integrationId) public view virtual returns (string memory integrationName);

    // Retrieves the registry's unique identifier for an existing release of a package.
    function getReleaseId(string memory integrationName, string memory version) public view virtual returns (bytes32 releaseId);

    // Retrieves a slice of the list of all release ids for an integration.
    // `offset` and `limit` enable paginated responses / retrieval of the complete set. (See note below)
    function getAllReleaseIds(string memory integrationName, uint offset) public view virtual
    returns (
        bytes32[16] memory integrationIds,
        uint next
    );

    // Retrieves package name, release version and URI location data for a release id.
    function getReleaseData(bytes32 releaseId) public view virtual
    returns (
        string memory integrationName,
        string memory version,
        bytes32 manifestHash,
        IntegrationType integrationType
    );

    // Retrieves the release id a registry *would* generate for a package name and version pair
    // when executing a release.
    function generateReleaseId(string memory integrationName, string memory version)
    public
    view
    virtual
    returns (bytes32 releaseId);

    // Returns the total number of unique packages in a registry.
    function numPackageIds() public view virtual returns (uint totalCount);

    // Returns the total number of unique releases belonging to the given packageName in a registry.
    function numReleaseIds(string memory integrationName) public view virtual returns (uint totalCount);

    function initialize() initializer public {
        __Ownable_init();
    }
}
