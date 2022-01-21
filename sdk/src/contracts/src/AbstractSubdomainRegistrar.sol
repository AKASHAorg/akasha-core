// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import '@ensdomains/ens-contracts/contracts/registry/ENS.sol';
import '@ensdomains/ens-contracts/contracts/registry/ENSRegistry.sol';
import '@ensdomains/ens-contracts/contracts/registry/ENSRegistryWithFallback.sol';
import '@ensdomains/ens-contracts/contracts/registry/ReverseRegistrar.sol';
import '@ensdomains/ens-contracts/contracts/resolvers/Resolver.sol';

abstract contract AbstractSubdomainRegistrar {

    // namehash('eth')
    bytes32 constant public TLD_NODE = 0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae;
    // namehash('akasha.eth')
    bytes32 constant public ROOT_NODE = 0x43bba60d9ee890bd3cd87a2a11df3f21a591ec3a99af5532f3795352370d266b;

    bool public stopped = false;
    address public registrarOwner;

    address public registrar;


    ENS public ens;

    modifier owner_only(bytes32 label) {
        require(owner(label) == msg.sender);
        _;
    }

    modifier not_stopped() {
        require(!stopped);
        _;
    }

    modifier registrar_owner_only() {
        require(msg.sender == registrarOwner);
        _;
    }

    constructor(ENS _ens) {
        ens = _ens;
        registrar = ens.owner(TLD_NODE);
        registrarOwner = msg.sender;
    }

    function doRegistration(bytes32 node, bytes32 label, address subdomainOwner, Resolver resolver) internal {
        // Get the subdomain so we can configure it
        ens.setSubnodeOwner(node, label, address(this));

        bytes32 subnode = keccak256(abi.encodePacked(node, label));
        // Set the subdomain's resolver
        ens.setResolver(subnode, address(resolver));

        // Set the address record on the resolver
        resolver.setAddr(subnode, subdomainOwner);

        // Pass ownership of the new subdomain to the registrant
        ens.setOwner(subnode, subdomainOwner);
    }

    function supportsInterface(bytes4 interfaceID) public pure returns (bool) {
        return (
            (interfaceID == 0x01ffc9a7) // supportsInterface(bytes4)
            || (interfaceID == 0xc1b15f5a) // RegistrarInterface
        );
    }

    /**
     * @dev Stops the registrar, disabling configuring of new domains.
     */
    function stop() public not_stopped registrar_owner_only {
        stopped = true;
    }

    function transferOwnership(address newOwner) public registrar_owner_only {
        registrarOwner = newOwner;
    }

    function reclaimRoot() public registrar_owner_only {
        ens.setOwner(ROOT_NODE, registrarOwner);
    }

    function owner(bytes32 label) public view virtual returns (address);
}
