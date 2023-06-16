// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract Dauthenticator {

    mapping(address => otp_item[]) private otp_item_map;
    mapping(address => string[]) private otp_keys;
    mapping(address => uint256) private otp_tables;

    struct otp_item {
        string key;
        string secret;
    }

    function compare(string memory str1, string memory str2) public pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    function add(string memory key, string memory secret) public {
        if (otp_keys[msg.sender].length == 0) {
            uint256 _tableId = TablelandDeployments.get().create(
                msg.sender,
                SQLHelpers.toCreateFromSchema(
                    "id integer primary key autoincrement," // Notice the trailing comma
                    "key text"
                    "data text", // Separate lines for readability—but it's a single string
                    "dauthenticator"
                )
            );
            otp_tables[msg.sender] = _tableId;
        }
        otp_item_map[msg.sender].push(otp_item(key, secret));
        otp_keys[msg.sender].push(key);

        TablelandDeployments.get().mutate(
            address(this),
            otp_tables[msg.sender],
            SQLHelpers.toInsert(
            "dauthenticator",
            otp_tables[msg.sender],
            "key,data",
            string.concat(
                key, // Convert to a string
                ",",
                secret) // Wrap strings in single quotes
            )
        );
    }

    function list() public view returns (string[] memory){
        return otp_keys[msg.sender];
    }

    function remove(uint index) public {
        otp_item_map[msg.sender][index] = otp_item_map[msg.sender][otp_item_map[msg.sender].length - 1];
        otp_item_map[msg.sender].pop();
        otp_keys[msg.sender][index] = otp_keys[msg.sender][otp_keys[msg.sender].length - 1];
        otp_keys[msg.sender].pop();
    }

    function get(address _address, string memory key) public view returns (string memory) {
        otp_item[] memory items = otp_item_map[_address];
        for (uint i=0; i<items.length; i++) {
            if(compare(key, items[i].key)) {
                return items[i].secret;
            }
        }
        return "";
    }

    function getTable(address _address) public view returns (uint) {
        return otp_tables[_address];
    }
}