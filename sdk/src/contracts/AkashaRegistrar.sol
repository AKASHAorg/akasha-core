pragma solidity ^0.5.0;

import "./AbstractSubdomainRegistrar.sol";
import "@ensdomains/ens/contracts/Registrar.sol";
import "@ensdomains/ens/contracts/ReverseRegistrar.sol";
import "@ensdomains/resolver/contracts/Resolver.sol";

contract AkashaRegistrar is AbstractSubdomainRegistrar {


    modifier new_registrar() {
        require(ens.owner(ROOT_NODE) != address(registrar));
        _;
    }

    event AkashaName(bytes32 indexed label, string name);

    constructor(ENS ens) AbstractSubdomainRegistrar(ens) public { }

    /**
     * @dev owner returns the address of the account that controls a subdomain.
     * @param label The label hash of the deed to check.
     * @return The address owning the subdomain/label.
     */
    function owner(bytes32 label) public view returns (address) {
        return ens.owner(keccak256(abi.encodePacked(ROOT_NODE, label)));
    }

    /**
    * @dev Checks if a subdomain is registered
    * @param subdomain The subdomain to check
    */
    function isAvailable(string memory subdomain) public view returns (bool) {
        bytes32 subdomainLabel = keccak256(bytes(subdomain));
        return ens.owner(keccak256(abi.encodePacked(ROOT_NODE, subdomainLabel))) == address(0);
    }

    /**
     * @dev Registers a subdomain.
     * @param subdomain The desired subdomain label.
     */
    function register(string calldata subdomain, address resolver) external not_stopped {
        address subdomainOwner = msg.sender;
        bytes32 subdomainLabel = keccak256(bytes(subdomain));

        // Subdomain must not be registered already.
        require(ens.owner(keccak256(abi.encodePacked(ROOT_NODE, subdomainLabel))) == address(0));

        doRegistration(ROOT_NODE, subdomainLabel, subdomainOwner, Resolver(resolver));
        // Register the reverse, it doesn't work because of msg.sender
        // string memory domain = ".akasha.eth";
        // bytes32 node = ReverseRegistrar(reverseRegistrar).claimWithResolver(msg.sender, resolver);
        // add a friendly name to the reversed node hash
        // Resolver(resolver).setName(node, string(abi.encodePacked(subdomain, domain)));
        emit AkashaName(subdomainLabel, subdomain);
    }

}
