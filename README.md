
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mhhf/spore?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

**IMPORTANT: This is a proof of concept prototype and shouldn't be used in production**

![](named_logo.png)


For fast development of DApps a package management is needed. 
Spore is a Proof of Concept prototype for a such package manager build on top of truffle, ethereum and ipfs.

Any form on Feedback and contribution is highly wellcome.

## Installation

Make sure you have node v4+ installed:
```
$ node --version
v4.0.0
```

Install Spore: 
```
npm i -g eth-spore
```

On your first run spore will guide you trough a eth-rpc and ipfs configuration.


For full decentral usage:
* install [ipfs](https://ipfs.io/docs/install/).
* install [ethereum rpc node](https://ipfs.io/docs/install/)

## Usage

```
$ spore --help

Simple package management for Ethereum

Usage:
  spore init
  spore upgrade
  spore publish 
  spore add       <path>
  spore link
  
  spore info     [<package>]
  spore install  [<package>]
  spore clone     <package>
  spore uninstall <package>
  
  spore remote list
  spore remote select <name>
  spore remote add    <name>
  spore remote remove <name>
  
  spore update
  spore search <string>
  
  spore instance add <package> <address> [--contract <contract>]
  spore instance list <package>
  
Arguments:
  <package>                    Package name or hash
  <path>                       path to file/ directory
  <name>                       rpc settings name
  
Options:
  -v, --version                Shows the version of spore
  -h, --help                   Shows this help screen
  --verbose                    Shows interlal logs


```

## GUI
http://spore.memhub.io

![](gui.png)
(Decentral version on IPFS will follow shortly)

### Workflow
Create a new project:
```
mkdir mypackage 
cd mypackage
truffle init
spore init
```

this will create a spore.json in your root project directory:
```js
{
  "name": "mypackage",
  "version": "0.1.0",
  "description": "description",
  "dependencies": {},
  "contracts": [],
  "ignore": [],
  "files": []
}
```

install dependencies:
```
spore install LinkedList
spore install mortal
```

add some files:
```
spore add contracts/mycontract.sol
spore add readme.md
```

publish the package:
```
spore publish
```

Now you can install the package `mypackage` along with it's dependencies in another project via:
```
spore install new
```

## API documentation

### Help
```
$ spore --help 

Simple package management for Ethereum

Usage:
  spore init
  spore upgrade
  spore publish 
  spore add       <path>
  spore link
  
  spore info     [<package>]
  spore install  [<package>]
  spore clone     <package>
  spore uninstall <package>
  
  spore remote list
  spore remote select <name>
  spore remote add    <name>
  spore remote remove <name>
  
  spore update
  spore search <string>
  
  spore instance add <package> <address> [--contract <contract>]
  spore instance list <package>
  
Arguments:
  <package>                    Package name or hash
  <path>                       path to file/ directory
  <name>                       rpc settings name
  
Options:
  -v, --version                Shows the version of spore
  -h, --help                   Shows this help screen
  --verbose                    Shows interlal logs
```

###init
```
spore init
```

Initializes a new spore project in your directory. Will ask you about the project name,
version and (short) description of your project.

This will create a `spore.json` in your current directory:

##### Example
```
$ spore init

Name of your project [myproject]:
Version [0.1.0]: 0.0.1
Package description : My test project.

init spore

$ cat spore.json
{
  "name": "myproject",
  "version": "0.0.1",
  "description": "My test project.",
  "dependencies": {},
  "contracts": [],
  "ignore": [],
  "files": [],
  "tags": []
}
```

### upgrade
```
spore upgrade
```

Upgrade all top level dependencies to the newest version.

##### Example
```
$ spore upgrade
Packages updated:
 owned -> QmY9D8A1PHAWuXgbbF5VrkRmnjn1YHKFqDwsBCxys9TCQh
```

### publish
```
spore publish
```

Publishes your package to the current selected chain.
1. It compiles all contracts listed in your `spore.json` and adds them to your package header.
2. It pushes all files listed in your `spore.json` to ipfs and adds the root ipfs hash to the header.
3. The json Header is allso pushed to ipfs and its hash published to the spore contract.

##### Example
```
$ spore publish
brace yourself, gas will be spend!
Package published: Qma8aCXafZYjni9iWPoWRTiEAqrDY1C6qAKFri1gSpGBhK
```

### add
```
spore add <path>
```
Adds files to your `spore.json`. Path can point to a file or directory.

##### Example
```
$ spore add contracts
Added files:
contracts/mycontract.sol
contracts/myothercontract.sol
```

### link
```
spore link
```
Go trouh all your contracts, included in your `spore.json` and trys to replace `import` statements with your dependencies.

##### Example
You have the following `mortal.sol` contract:
```
import "owned"

contract mortal is owned {

...
```

Now the contract `owned` is a dependency you previously included via `spore install owned`, 
which is located in `spore_packages/owned-Y9D8A1PH/contracts/owned`.
To help your compiler find your dependency, just run:
```
spore link
```

and it replaces your import statement with a relative path to your dependent contract. Your `mortal.sol` contract will be looking like this:
```
import "../spore_packages/owned-Y9D8A1PH/contracts/owned";

contract mortal is owned {

...
```

### info
```
spore info [<package>]
```
Prints the info about a package. If no package is specified, it prints out the info of your current project.


##### Example
```
$ spore info spore
{
  "name": "spore",
  "version": "0.1.0",
  "description": "Simple package manager for dapp development.",
  "dependencies": {},
  "contracts": {
    "Spore": "Qmf34xWuPHtRdsH8RR4jYnbrBRBkJ6n9WfazX7Z65SCJ6V"
  },
  "tags": [
    "package",
    "manager",
    "test"
  ],
  "root": "QmPZWqn4ZRhGFJCTnNvaz3Wwe6inKQ4n6nJic4bAw3maz3",
  "solc": "0.1.3-4457170b",
  "pv": "0.0.3"
}
```

### install
```
spore install [<package>]
```

Install a specified package recursively with its dependencies.
Only the specified package will be add to your `spore.json` not its dependencies.
Also the content of all packages will be added to your `spore_packages` directory 
in your project folder. 

If no package is specified, it will forward to `spore upgrade`.

##### Example
```
$ spore install mortal
Package mortal installed.
```

### clone
```
spore clone <package>
```

This will clone `<package>` to your current directory.

##### Example
```
$ spore clone mortal
mortal cloned!

$ tree mortal
mortal
├── contracts
│   └── mortal.sol
└── spore.json

1 directory, 2 files
```

### uninstall
```
spore uninstall <package>
```

This will uninstall `<package>` from `spore.json` and also remove unneeded packages from `spore_packages`.

##### Example
```
$ spore uninstall owned
Package "owned" successful removed.
```

### remote list
```
spore remote list
```

Spore allows you to access multipe spore instances on multiple chains. 
This will print information and status of all instances and chains.

##### Example
```
$ spore remote list
"origin" ONLINE
  host: spore.memhub.io
  port: 8545
  address: 0x774b349719f8007bb479c5721e510d4803385d04


"testnet" ONLINE SELECTED
  host: 192.168.59.103
  port: 8545
  address: 0x774b349719f8007bb479c5721e510d4803385d04
  
  
"mainnet" ONLINE 
  host: 192.168.59.103
  port: 8546
  address: 0x295b5c7a5c533eb11ef3653769f089345384db4c
  
  
"test" OFFLINE
  host: localhost
  port: 8545
  address: 0x1234567891234567891234567891234567891234
```

### remote select
```
spore remote select <name>
```

Point to a spore instance in your list to get access to it.

##### Example
```
spore remote select origin
```

### remote add
```
spore remote add <name>
```

Add a new spore instance or chain to the list.

##### Example
```
spore remote add <name>
Ethereum rpc host ( xxx.xxx.xxx.xxx ): localhost
Ethereum rpc port [8545]:
```

### remote remove
```
spore remote remove <name>
```

Removes a chain and instance specification.

##### Example
```
spore remote remove origin
```

### update
```
spore update
```

Fetches all packages and their headers to a local database to make them searchable.
Currently in alpha and not production ready.

##### Example
```
$ spore update
Packages updated: mortal, coin
```

### search
```
spore search <string>
```

Search your local database for keywords.

##### Example
```
$ spore search manager
last update from 2015-10-09T17:27:32.108Z
Found 1 results for search manager:

  spore: Simple package manager for dapp development.
```

### instance add
```
spore instance add <package> <address> [--contract <contract>]
```

This is a addon with a seperate contract, which holds a list of deployed 
contract instances for every package.
Everybody can push a new instance.

The contract flag is optional and has to be set, if a package contains more then one contract.

##### Example 
```
$ spore instance add 0x774b349719f8007bb479c5721e510d4803385d04
```

### instance list
```
spore instance list <package>
```

This will list all instances found for a given package
##### Example
```
$ spore instance list spore
[ { name: 'Spore',
    addr: '0x774b349719f8007bb479c5721e510d4803385d04' } ]
```


## Development - Installation
This will guide you trough a **local** development installation. The contract is not deployed on a global chain, yet.

Make sure you have node v4+ installed:
```
$ node --version
v4.0.0
```

Make sure you have [solidity](https://github.com/ethereum/cpp-ethereum/wiki) installed:

```
$ solc --version
solc, the solidity compiler commandline interface
Version: 0.1.1-ed7a8a35/Release-Darwin/clang/JIT
```

Install [eth-testrpc](https://github.com/ConsenSys/eth-testrpc) for testing/ dev purposes.
`pip install eth-testrpc`

Install [truffle](https://github.com/ConsenSys/truffle).
`npm install -g truffle`

Install [ipfs](https://ipfs.io/docs/install/).

clone this repo:
`git clone https://github.com/mhhf/spore.git`

install:
```
cd spore
npm install
npm link
```
Run your rpc client( In this case testrpc `testrpc` )

Deploy the spore ethereum contract with: `truffle deploy`


## Test
Run a local chain:
`testrpc`

Deploy the contract:
`truffle deploy`

Run the test:
`mocha test`

## How it works
[This](https://github.com/mhhf/spore/blob/master/contracts/Spore.sol) Ethereum contract has a ` name => ipfs-hash ` mapping and some functionallity to access and manipulate it.

The ipfs-hash is pointing to a package-header which specified by [this](https://github.com/mhhf/spore/blob/master/src/ipfs_spec.json) json schema.
An example header for `spore` is:
```js
{
  "name": "spore",
  "version": "0.1.0",
  "description": "Simple package manager for dapp development.",
  "dependencies": {},
  "contracts": [
    "Spore"
  ],
  "ignore": [],
  "files": [
    "contracts/Spore.sol"
  ],
  "tags": [
    "spore",
    "package manager"
  ]
}

```

The *dependencies* property contains packages with their ipfs header file.
The *root* property points to a ipfs directory node which contains the package files.
