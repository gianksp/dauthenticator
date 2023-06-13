// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

contract Dauthenticator {

    mapping(address => otp_item[]) private otp_item_map;

    struct otp_item {
        string key;
        string secret;
    }

    function compare(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function add(string memory key, string memory secret) public {
        otp_item_map[msg.sender].push(otp_item(key, secret));
    }

    function list() public view returns (otp_item[] memory){
        return otp_item_map[msg.sender];
    }

    function remove(uint index) public {
        otp_item_map[msg.sender][index] = otp_item_map[msg.sender][otp_item_map[msg.sender].length - 1];
        otp_item_map[msg.sender].pop();
    }

    function get(string memory key) public view returns (string memory) {
        otp_item[] memory items = otp_item_map[msg.sender];
        for (uint i=0; i<items.length; i++) {
            if(compare(key, items[i].key)) {
                return items[i].secret;
            }
        }
        return "";
    }
}