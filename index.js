require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const { HttpsProxyAgent } = require('https-proxy-agent');
const randomUseragent = require('random-useragent');
const axios = require('axios');
const prompt = require('prompt-sync')({ sigint: true });

// Enhanced UI Libraries
const chalk = require('chalk');
const gradient = require('gradient-string');
const figlet = require('figlet');
const cliProgress = require('cli-progress');
const boxen = require('boxen');
const ora = require('ora');
const inquirer = require('inquirer');

// Modern color scheme with gradients
const theme = {
    primary: chalk.hex('#00D4FF'),
    secondary: chalk.hex('#FF6B6B'),
    success: chalk.hex('#51CF66'),
    warning: chalk.hex('#FFD43B'),
    error: chalk.hex('#FF6B6B'),
    info: chalk.hex('#74C0FC'),
    muted: chalk.hex('#868E96'),
    accent: chalk.hex('#9775FA'),
    highlight: chalk.hex('#FFA8CC'),
    
    // Gradients
    primaryGradient: gradient(['#00D4FF', '#0099CC']),
    successGradient: gradient(['#51CF66', '#40C057']),
    errorGradient: gradient(['#FF6B6B', '#E03131']),
    accentGradient: gradient(['#9775FA', '#7950F2']),
    rainbowGradient: gradient.rainbow,
    oceanGradient: gradient(['#667eea', '#764ba2']),
    fireGradient: gradient(['#f093fb', '#f5576c']),
};

// Enhanced Logger with modern styling
const logger = {
    banner: () => {
        console.clear();
        const title = figlet.textSync('EARNINGDROPS', {
            font: 'ANSI Shadow',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        });
        
        console.log(theme.oceanGradient(title));
        console.log(boxen(
            theme.primaryGradient('🚀 Advanced Testnet Automation Bot\n') +
            theme.muted('Powered by EARNINGDROPS | Built with ❤️\n') +
            theme.info('━'.repeat(50)),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: '#00D4FF',
                backgroundColor: '#1a1a1a'
            }
        ));
    },

    section: (title) => {
        const decoratedTitle = `✨ ${title} ✨`;
        console.log('\n' + boxen(
            theme.accentGradient(decoratedTitle),
            {
                padding: { top: 0, bottom: 0, left: 2, right: 2 },
                borderStyle: 'round',
                borderColor: '#9775FA',
                align: 'center'
            }
        ));
    },

    info: (msg, icon = '💡') => {
        console.log(`${theme.info(icon)} ${theme.primary('│')} ${msg}`);
    },

    success: (msg, icon = '✅') => {
        console.log(`${theme.success(icon)} ${theme.success('│')} ${theme.successGradient(msg)}`);
    },

    error: (msg, icon = '❌') => {
        console.log(`${theme.error(icon)} ${theme.error('│')} ${theme.errorGradient(msg)}`);
    },

    warning: (msg, icon = '⚠️') => {
        console.log(`${theme.warning(icon)} ${theme.warning('│')} ${theme.warning(msg)}`);
    },

    wallet: (msg, icon = '👛') => {
        console.log(`${theme.highlight(icon)} ${theme.accent('│')} ${theme.accentGradient(msg)}`);
    },

    transaction: (msg, icon = '🔄') => {
        console.log(`${theme.info(icon)} ${theme.primary('│')} ${msg}`);
    },

    step: (msg, icon = '▶️') => {
        console.log(`${theme.muted(icon)} ${theme.muted('│')} ${theme.muted(msg)}`);
    },

    loading: (msg) => {
        return ora({
            text: msg,
            spinner: 'dots12',
            color: 'cyan'
        }).start();
    },

    stats: (stats) => {
        const statsBox = Object.entries(stats)
            .map(([key, value]) => `${theme.accent('▪')} ${key}: ${theme.primary(value)}`)
            .join('\n');
        
        console.log(boxen(
            statsBox,
            {
                title: theme.accent('📊 Statistics'),
                titleAlignment: 'center',
                padding: 2,
                borderStyle: 'round',
                borderColor: '#9775FA'
            }
        ));
    },

    userInfo: (userInfo) => {
        const infoBox = 
            `${theme.success('🆔')} User ID: ${theme.primary(userInfo.ID)}\n` +
            `${theme.warning('🎯')} Task Points: ${theme.accent(userInfo.TaskPoints)}\n` +
            `${theme.info('💎')} Total Points: ${theme.successGradient(userInfo.TotalPoints)}`;
        
        console.log(boxen(
            infoBox,
            {
                title: theme.accent('👤 User Info & Points'),
                titleAlignment: 'center',
                padding: 1,
                borderStyle: 'round',
                borderColor: '#9775FA'
            }
        ));
    }
};

// Enhanced Progress Bar
class ModernProgressBar {
    constructor(total, title) {
        this.bar = new cliProgress.SingleBar({
            format: `${theme.accent('│')} ${title} ${theme.primary('│')} {bar} ${theme.success('│')} {percentage}% ${theme.muted('│')} {value}/{total} ${theme.info('│')} ETA: {eta}s`,
            barCompleteChar: '█',
            barIncompleteChar: '░',
            hideCursor: true,
            barsize: 30,
            stopOnComplete: true
        }, cliProgress.Presets.shades_classic);
        
        this.bar.start(total, 0);
    }

    update(current) {
        this.bar.update(current);
    }

    stop() {
        this.bar.stop();
    }
}

// Enhanced Countdown with visual effects
const modernCountdown = async (minutes) => {
    const totalSeconds = minutes * 60;
    logger.section(`⏱️  COUNTDOWN - ${minutes} MINUTES`);
    
    const countdownBar = new ModernProgressBar(totalSeconds, '⏳ Waiting');
    
    for (let seconds = totalSeconds; seconds >= 0; seconds--) {
        const progress = totalSeconds - seconds;
        countdownBar.update(progress);
        
        if (seconds % 60 === 0 && seconds > 0) {
            const mins = Math.floor(seconds / 60);
            logger.info(`${mins} minute${mins > 1 ? 's' : ''} remaining...`, '⏰');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    countdownBar.stop();
    logger.success('Countdown complete! 🎉', '🚀');
};

// Enhanced Configuration Menu
const getConfiguration = async () => {
    console.log(boxen(
        theme.fireGradient('🔧 CONFIGURATION SETUP'),
        {
            padding: 1,
            borderStyle: 'bold',
            borderColor: '#FF6B6B',
            align: 'center'
        }
    ));

    const questions = [
        {
            type: 'input',
            name: 'delayMinutes',
            message: theme.primary('⏱️ Enter delay between cycles (minutes):'),
            default: '30',
            prefix: '', // Add this line to remove the '?'
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
            }
        },
        {
            type: 'input',
            name: 'numTransfers',
            message: theme.accent('💸 Number of transfers per cycle:'),
            default: '10',
            prefix: '', // Add this line to remove the '?'
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
            }
        },
        {
            type: 'input',
            name: 'numSwaps',
            message: theme.success('🔄 Number of swaps per cycle:'),
            default: '10',
            prefix: '', // Add this line to remove the '?'
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
            }
        },
        {
            type: 'input',
            name: 'numWraps',
            message: theme.warning('📦 Number of wraps per cycle:'),
            default: '10',
            prefix: '', // Add this line to remove the '?'
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
            }
        },
        {
            type: 'input',
            name: 'numLPs',
            message: theme.info('🏊 Number of LP additions per cycle:'),
            default: '10',
            prefix: '', // Add this line to remove the '?'
            validate: (input) => {
                const num = parseInt(input);
                return !isNaN(num) && num > 0 ? true : 'Please enter a valid number';
            }
        }
    ];

    return await inquirer.prompt(questions);
};

// Configuration and constants
const networkConfig = {
    name: 'Pharos Testnet',
    chainId: 688688,
    rpcUrl: 'https://testnet.dplabs-internal.com',
    currencySymbol: 'PHRS',
};

const tokens = {
    USDC: '0xad902cf99c2de2f1ba5ec4d642fd7e49cae9ee37',
    WPHRS: '0x76aaada469d23216be5f7c596fa25f282ff9b364',
    USDT: '0xed59de2d7ad9c043442e381231ee3646fc3c2939',
    POSITION_MANAGER: '0xF8a1D4FF0f9b9Af7CE58E1fc1833688F3BFd6115',
};

const poolAddresses = {
    USDC_WPHRS: '0x0373a059321219745aee4fad8a942cf088be3d0e',
    USDT_WPHRS: '0x70118b6eec45329e0534d849bc3e588bb6752527',
};

const contractAddress = '0x1a4de519154ae51200b0ad7c90f7fac75547888a';

const tokenDecimals = {
    WPHRS: 18,
    USDC: 6,
    USDT: 6,
};

const contractAbi = [
    {
        inputs: [
            { internalType: 'uint256', name: 'collectionAndSelfcalls', type: 'uint256' },
            { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
        ],
        name: 'multicall',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const erc20Abi = [
    'function balanceOf(address) view returns (uint256)',
    'function allowance(address owner, address spender) view returns (uint256)',
    'function approve(address spender, uint256 amount) public returns (bool)',
    'function decimals() view returns (uint8)',
    'function deposit() public payable',
    'function withdraw(uint256 wad) public',
];

const positionManagerAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: 'address', name: 'token0', type: 'address' },
                    { internalType: 'address', name: 'token1', type: 'address' },
                    { internalType: 'uint24', name: 'fee', type: 'uint24' },
                    { internalType: 'int24', name: 'tickLower', type: 'int24' },
                    { internalType: 'int24', name: 'tickUpper', type: 'int24' },
                    { internalType: 'uint256', name: 'amount0Desired', type: 'uint256' },
                    { internalType: 'uint256', name: 'amount1Desired', type: 'uint256' },
                    { internalType: 'uint256', name: 'amount0Min', type: 'uint256' },
                    { internalType: 'uint256', name: 'amount1Min', type: 'uint256' },
                    { internalType: 'address', name: 'recipient', type: 'address' },
                    { internalType: 'uint256', name: 'deadline', type: 'uint256' },
                ],
                internalType: 'struct INonfungiblePositionManager.MintParams',
                name: 'params',
                type: 'tuple',
            },
        ],
        name: 'mint',
        outputs: [
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
            { internalType: 'uint128', name: 'liquidity', type: 'uint128' },
            { internalType: 'uint256', name: 'amount0', type: 'uint256' },
            { internalType: 'uint256', name: 'amount1', type: 'uint256' },
        ],
        stateMutability: 'payable',
        type: 'function',
    },
];

const pairOptions = [
    { id: 1, from: 'WPHRS', to: 'USDC', amount: 0.0001 },
    { id: 2, from: 'WPHRS', to: 'USDT', amount: 0.0001 },
    { id: 3, from: 'USDC', to: 'WPHRS', amount: 0.0001 },
    { id: 4, from: 'USDT', to: 'WPHRS', amount: 0.0001 },
    { id: 5, from: 'USDC', to: 'USDT', amount: 0.0001 },
    { id: 6, from: 'USDT', to: 'USDC', amount: 0.0001 },
];

const lpOptions = [
    { id: 1, token0: 'WPHRS', token1: 'USDC', amount0: 0.0001, amount1: 0.0001, fee: 3000 },
    { id: 2, token0: 'WPHRS', token1: 'USDT', amount0: 0.0001, amount1: 0.0001, fee: 3000 },
];

const loadProxies = () => {
    try {
        const proxies = fs.readFileSync('proxies.txt', 'utf8')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);
        logger.info(`Loaded ${proxies.length} proxies`, '🌐');
        return proxies;
    } catch (error) {
        logger.warning('No proxies.txt found, using direct mode', '🚫');
        return [];
    }
};

const getRandomProxy = (proxies) => {
    return proxies[Math.floor(Math.random() * proxies.length)];
};

const setupProvider = (proxy = null) => {
    if (proxy) {
        logger.info(`Using proxy: ${theme.muted(proxy)}`, '🌐');
        const agent = new HttpsProxyAgent(proxy);
        return new ethers.JsonRpcProvider(networkConfig.rpcUrl, {
            chainId: networkConfig.chainId,
            name: networkConfig.name,
        }, {
            fetchOptions: { agent },
            headers: { 'User-Agent': randomUseragent.getRandom() },
        });
    } else {
        logger.info('Using direct connection', '🔗');
        return new ethers.JsonRpcProvider(networkConfig.rpcUrl, {
            chainId: networkConfig.chainId,
            name: networkConfig.name,
        });
    }
};

const waitForTransactionWithRetry = async (provider, txHash, maxRetries = 5, baseDelayMs = 1000) => {
    let retries = 0;
    const spinner = logger.loading(`Waiting for transaction: ${theme.muted(txHash.slice(0, 10))}...`);
    
    while (retries < maxRetries) {
        try {
            const receipt = await provider.getTransactionReceipt(txHash);
            if (receipt) {
                spinner.succeed(`Transaction confirmed: ${theme.success(txHash.slice(0, 10))}...`);
                return receipt;
            }
            
            await new Promise(resolve => setTimeout(resolve, baseDelayMs * Math.pow(2, retries)));
            retries++;
        } catch (error) {
            if (error.code === -32008) { // Transaction not found yet
                await new Promise(resolve => setTimeout(resolve, baseDelayMs * Math.pow(2, retries)));
                retries++;
            } else {
                spinner.fail(`Transaction failed: ${error.message}`);
                throw error;
            }
        }
    }
    
    spinner.fail(`Transaction timeout after ${maxRetries} retries`);
    throw new Error(`Failed to get transaction receipt for ${txHash} after ${maxRetries} retries`);
};

const checkBalanceAndApproval = async (wallet, tokenAddress, amount, decimals, spender) => {
    try {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
        const balance = await tokenContract.balanceOf(wallet.address);
        const required = ethers.parseUnits(amount.toString(), decimals);

        if (balance < required) {
            const tokenSymbol = Object.keys(tokenDecimals).find(key => tokenDecimals[key] === decimals);
            logger.warning(
                `Insufficient ${tokenSymbol} balance: ${theme.error(ethers.formatUnits(balance, decimals))} < ${theme.success(amount)}`,
                '💸'
            );
            return false;
        }

        const allowance = await tokenContract.allowance(wallet.address, spender);
        if (allowance < required) {
            const spinner = logger.loading(`Approving ${amount} tokens...`);
            
            try {
                const estimatedGas = await tokenContract.approve.estimateGas(spender, ethers.MaxUint256);
                const feeData = await wallet.provider.getFeeData();
                const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
                
                const approveTx = await tokenContract.approve(spender, ethers.MaxUint256, {
                    gasLimit: Math.ceil(Number(estimatedGas) * 1.2),
                    gasPrice,
                    maxFeePerGas: feeData.maxFeePerGas || undefined,
                    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
                });
                
                const receipt = await waitForTransactionWithRetry(wallet.provider, approveTx.hash);
                spinner.succeed('Token approval completed');
            } catch (error) {
                spinner.fail(`Approval failed: ${error.message}`);
                return false;
            }
        }

        return true;
    } catch (error) {
        logger.error(`Balance/approval check failed: ${error.message}`, '❌');
        return false;
    }
};

const getUserInfo = async (wallet, proxy = null, jwt) => {
    try {
        if (!jwt) {
            logger.warning('Skipping user info fetch as no JWT token is available.', '⚠️');
            return;
        }

        const profileUrl = `https://api.pharosnetwork.xyz/user/profile?address=${wallet.address}`;
        const headers = {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.8",
            authorization: `Bearer ${jwt}`,
            "sec-ch-ua": '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            Referer: "https://testnet.pharosnetwork.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "User-Agent": randomUseragent.getRandom(),
        };

        const axiosConfig = {
            method: 'get',
            url: profileUrl,
            headers,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        };

        const spinner = logger.loading('Fetching user profile...');
        const response = await axios(axiosConfig);
        const data = response.data;

        if (data.code !== 0 || !data.data.user_info) {
            spinner.fail(`Failed to fetch user info: ${data.msg || 'Unknown error'}`);
            return;
        }

        spinner.succeed('User profile fetched successfully');
        const userInfo = data.data.user_info;
        logger.userInfo(userInfo);
    } catch (error) {
        logger.error(`Failed to fetch user info: ${error.message}`, '❌');
        if (error.response && error.response.status === 403) {
            logger.error('Received 403 Forbidden. This indicates an invalid or expired JWT token. Please ensure your authentication logic is correct.', '🚨');
        }
    }
};

const verifyTask = async (wallet, proxy, jwt, txHash) => {
    try {
        if (!jwt) {
            logger.warning('Skipping task verification as no JWT token is available.', '⚠️');
            return false;
        }

        const verifyUrl = `https://api.pharosnetwork.xyz/task/verify?address=${wallet.address}&task_id=103&tx_hash=${txHash}`;
        
        const headers = {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.8",
            authorization: `Bearer ${jwt}`,
            priority: "u=1, i",
            "sec-ch-ua": '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            Referer: "https://testnet.pharosnetwork.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "User-Agent": randomUseragent.getRandom(),
        };

        const axiosConfig = {
            method: 'post',
            url: verifyUrl,
            headers,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        };

        const spinner = logger.loading('Verifying task...');
        const response = await axios(axiosConfig);
        const data = response.data;

        if (data.code === 0 && data.data.verified) {
            spinner.succeed(`Task verified for ${theme.success(txHash.slice(0, 10))}...`);
            return true;
        } else {
            spinner.fail(`Task verification failed: ${data.msg || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        logger.error(`Task verification failed: ${error.message}`, '❌');
        if (error.response && error.response.status === 403) {
            logger.error('Received 403 Forbidden. This indicates an invalid or expired JWT token. Please ensure your authentication logic is correct.', '🚨');
        }
        return false;
    }
};

// Function to get multicall data for a swap
const getMulticallData = (pair, amount, walletAddress) => {
    try {
        const decimals = tokenDecimals[pair.from];
        const scaledAmount = ethers.parseUnits(amount.toString(), decimals);

        // --- ATTENTION ---
        // The following encoding is highly specific and potentially fragile.
        // 1. Function Selector '0x04e45aaf' likely corresponds to a function like 'exactInputSingle'.
        //    Ensure this is the correct selector for the contract at 'contractAddress'.
        // 2. Data Types: The encoded types must EXACTLY match the function's parameter types.
        //    For a standard Uniswap V3 router, the fee should be 'uint24' and sqrtPriceLimitX96 should be 'uint160'.
        //    Your current code encodes the fee tier (500) as a 'uint256', which might be incorrect and cause reverts.
        const data = ethers.AbiCoder.defaultAbiCoder().encode(
            ['address', 'address', 'uint256', 'address', 'uint256', 'uint256', 'uint256'],
            [
                tokens[pair.from],
                tokens[pair.to],
                500, // This typically represents the fee tier. Uniswap V3 uses uint24. Ensure this is correct for your router.
                walletAddress,
                scaledAmount,
                0, // This is amountOutMin, set to 0 for maximum slippage. Consider setting a realistic minimum.
                0, // This is sqrtPriceLimitX96, usually 0 for direct swaps.
            ]
        );

        return [ethers.concat(['0x04e45aaf', data])];
    } catch (error) {
        logger.error(`Failed to generate multicall data: ${error.message}`, '❌');
        return [];
    }
};

// Function to perform a swap operation
const performSwap = async (wallet, provider, index, jwt, proxy) => {
    try {
        const pair = pairOptions[Math.floor(Math.random() * pairOptions.length)];
        const amount = pair.amount;
        
        logger.transaction(
            `Swap ${index + 1}: ${theme.accent(pair.from)} → ${theme.success(pair.to)} (${theme.primary(amount)})`,
            '🔄'
        );

        const decimals = tokenDecimals[pair.from];
        
        // --- FIX ---
        // The check for balance and approval is now handled entirely by the robust
        // `checkBalanceAndApproval` function. This avoids the incorrect `tokenContract.balance()` call
        // and removes redundant logic.
        if (!(await checkBalanceAndApproval(wallet, tokens[pair.from], amount, decimals, contractAddress))) {
            logger.warning(`Swap ${index + 1} skipped due to balance or approval issue.`, '⚠️');
            return;
        }

        const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
        const multicallData = getMulticallData(pair, amount, wallet.address);

        if (!multicallData || multicallData.length === 0 || multicallData.some(data => !data || data === '0x')) {
            logger.error(`Invalid multicall data for ${pair.from} → ${pair.to}`, '❌');
            return;
        }

        const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes from now
        let estimatedGas;
        
        try {
            // --- ATTENTION ---
            // You are passing 'deadline' as the first argument ('collectionAndSelfcalls') to your multicall function.
            // This is unusual. Ensure this is the expected behavior for your specific multicall contract.
            // Standard multicall contracts often only take a single bytes[] argument.
            estimatedGas = await contract.multicall.estimateGas(deadline, multicallData, {
                from: wallet.address,
            });
        } catch (error) {
            logger.error(`Gas estimation failed for swap: ${error.message}`, '⛽');
            return;
        }

        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
        
        const spinner = logger.loading(`Executing swap ${index + 1}...`);
        
        const tx = await contract.multicall(deadline, multicallData, {
            gasLimit: Math.ceil(Number(estimatedGas) * 1.2),
            gasPrice,
            maxFeePerGas: feeData.maxFeePerGas || undefined,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
        });

        spinner.text = `Waiting for swap confirmation for TX: ${tx.hash.slice(0, 10)}...`;
        const receipt = await waitForTransactionWithRetry(provider, tx.hash);
        
        spinner.succeed(`Swap ${index + 1} completed`);
        logger.success(`TX: ${theme.primary(`https://testnet.pharosscan.xyz/tx/${receipt.hash}`)}`, '🔗');

        if (jwt) { // Verify only if JWT is available
            await verifyTask(wallet, proxy, jwt, receipt.hash);
        } else {
            logger.warning('JWT token not available, skipping task verification for swap.', '⚠️');
        }
    } catch (error) {
        logger.error(`Swap ${index + 1} failed: ${error.message}`, '❌');
            if (error.transaction) {
            logger.error(`Transaction details: ${JSON.stringify(error.transaction, null, 2)}`, '🔍');
        }
        if (error.receipt) {
            logger.error(`Receipt: ${JSON.stringify(error.receipt, null, 2)}`, '📝');
        }
    }
};


const transferPHRS = async (wallet, provider, index, jwt, proxy) => {
    try {
        const amount = 0.000001; // Example amount
        const randomWallet = ethers.Wallet.createRandom();
        const toAddress = randomWallet.address;
        
        logger.transaction(
            `Transfer ${index + 1}: ${theme.primary(amount)} PHRS to ${theme.muted(toAddress.slice(0, 10))}...${theme.muted(toAddress.slice(-6))}`,
            '💸'
        );

        const balance = await provider.getBalance(wallet.address);
        const required = ethers.parseEther(amount.toString());

        if (balance < required) {
            logger.warning(
                `Skipping transfer ${index + 1}: Insufficient PHRS balance: ${theme.error(ethers.formatEther(balance))} < ${theme.success(amount)}`,
                '💸'
            );
            return;
        }

        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
        
        const spinner = logger.loading(`Executing transfer ${index + 1}...`);
        
        const tx = await wallet.sendTransaction({
            to: toAddress,
            value: required,
            gasLimit: 21000, // Standard gas limit for simple transfers
            gasPrice,
            maxFeePerGas: feeData.maxFeePerGas || undefined,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
        });

        spinner.text = `Waiting for transfer confirmation for TX: ${tx.hash.slice(0, 10)}...`;
        const receipt = await waitForTransactionWithRetry(provider, tx.hash);
        
        spinner.succeed(`Transfer ${index + 1} completed`);
        logger.success(`TX: ${theme.primary(`https://testnet.pharosscan.xyz/tx/${receipt.hash}`)}`, '🔗');

        if (jwt) { // Verify only if JWT is available
            await verifyTask(wallet, proxy, jwt, receipt.hash);
        } else {
            logger.warning('JWT token not available, skipping task verification for transfer.', '⚠️');
        }
    } catch (error) {
        logger.error(`Transfer ${index + 1} failed: ${error.message}`, '❌');
        if (error.transaction) {
            logger.error(`Transaction details: ${JSON.stringify(error.transaction, null, 2)}`, '🔍');
        }
        if (error.receipt) {
            logger.error(`Receipt: ${JSON.stringify(error.receipt, null, 2)}`, '📝');
        }
    }
};

const wrapPHRS = async (wallet, provider, index, jwt, proxy) => {
    try {
        const minAmount = 0.001;
        const maxAmount = 0.005;
        const amount = minAmount + Math.random() * (maxAmount - minAmount);
        const amountWei = ethers.parseEther(amount.toFixed(6).toString());
        
        logger.transaction(
            `Wrap ${index + 1}: ${theme.primary(amount.toFixed(6))} PHRS to WPHRS`,
            '📦'
        );

        const balance = await provider.getBalance(wallet.address);
        if (balance < amountWei) {
            logger.warning(
                `Skipping wrap ${index + 1}: Insufficient PHRS balance: ${theme.error(ethers.formatEther(balance))} < ${theme.success(amount.toFixed(6))}`,
                '💸'
            );
            return;
        }

        const wphrsContract = new ethers.Contract(tokens.WPHRS, erc20Abi, wallet);
        let estimatedGas;
        try {
            estimatedGas = await wphrsContract.deposit.estimateGas({ value: amountWei });
        } catch (error) {
            logger.error(`Gas estimation failed for wrap ${index + 1}: ${error.message}`, '⛽');
            return;
        }

        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
        
        const spinner = logger.loading(`Executing wrap ${index + 1}...`);
        
        const tx = await wphrsContract.deposit({
            value: amountWei,
            gasLimit: Math.ceil(Number(estimatedGas) * 1.2),
            gasPrice,
            maxFeePerGas: feeData.maxFeePerGas || undefined,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
        });

        spinner.text = `Waiting for wrap confirmation for TX: ${tx.hash.slice(0, 10)}...`;
        const receipt = await waitForTransactionWithRetry(provider, tx.hash);
        
        spinner.succeed(`Wrap ${index + 1} completed`);
        logger.success(`TX: ${theme.primary(`https://testnet.pharosscan.xyz/tx/${receipt.hash}`)}`, '🔗');

        if (jwt) { // Verify only if JWT is available
            await verifyTask(wallet, proxy, jwt, receipt.hash);
        } else {
            logger.warning('JWT token not available, skipping task verification for wrap.', '⚠️');
        }
    } catch (error) {
        logger.error(`Wrap ${index + 1} failed: ${error.message}`, '❌');
        if (error.transaction) {
            logger.error(`Transaction details: ${JSON.stringify(error.transaction, null, 2)}`, '🔍');
        }
        if (error.receipt) {
            logger.error(`Receipt: ${JSON.stringify(error.receipt, null, 2)}`, '📝');
        }
    }
};

const addLiquidity = async (wallet, provider, index, jwt, proxy) => {
    try {
        const pair = lpOptions[Math.floor(Math.random() * lpOptions.length)];
        const amount0 = pair.amount0;
        const amount1 = pair.amount1;
        
        logger.transaction(
            `LP Addition ${index + 1}: ${theme.accent(pair.token0)}/${theme.success(pair.token1)} (${theme.primary(amount0)} ${pair.token0}, ${theme.primary(amount1)} ${pair.token1})`,
            '🏊'
        );

        const decimals0 = tokenDecimals[pair.token0];
        const amount0Wei = ethers.parseUnits(amount0.toString(), decimals0);
        if (!(await checkBalanceAndApproval(wallet, tokens[pair.token0], amount0, decimals0, tokens.POSITION_MANAGER))) {
            return;
        }

        const decimals1 = tokenDecimals[pair.token1];
        const amount1Wei = ethers.parseUnits(amount1.toString(), decimals1);
        if (!(await checkBalanceAndApproval(wallet, tokens[pair.token1], amount1, decimals1, tokens.POSITION_MANAGER))) {
            return;
        }

        const positionManager = new ethers.Contract(tokens.POSITION_MANAGER, positionManagerAbi, wallet);

        const deadline = Math.floor(Date.now() / 1000) + 600;
        const tickLower = -60000; // Example tick range
        const tickUpper = 60000; // Example tick range

        const mintParams = {
            token0: tokens[pair.token0],
            token1: tokens[pair.token1],
            fee: pair.fee,
            tickLower,
            tickUpper,
            amount0Desired: amount0Wei,
            amount1Desired: amount1Wei,
            amount0Min: 0, // Set to 0 for maximum slippage tolerance
            amount1Min: 0, // Set to 0 for maximum slippage tolerance
            recipient: wallet.address,
            deadline,
        };

        let estimatedGas;
        try {
            estimatedGas = await positionManager.mint.estimateGas(mintParams, { from: wallet.address });
        } catch (error) {
            logger.error(`Gas estimation failed for LP ${index + 1}: ${error.message}`, '⛽');
            return;
        }

        const feeData = await provider.getFeeData();
        const gasPrice = feeData.gasPrice || ethers.parseUnits('1', 'gwei');
        
        const spinner = logger.loading(`Executing LP Addition ${index + 1}...`);
        
        const tx = await positionManager.mint(mintParams, {
            gasLimit: Math.ceil(Number(estimatedGas) * 1.2),
            gasPrice,
            maxFeePerGas: feeData.maxFeePerGas || undefined,
            maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
        });

        spinner.text = `Waiting for LP Addition confirmation for TX: ${tx.hash.slice(0, 10)}...`;
        const receipt = await waitForTransactionWithRetry(provider, tx.hash);
        
        spinner.succeed(`LP Addition ${index + 1} completed`);
        logger.success(`TX: ${theme.primary(`https://testnet.pharosscan.xyz/tx/${receipt.hash}`)}`, '🔗');

        if (jwt) { // Verify only if JWT is available
            await verifyTask(wallet, proxy, jwt, receipt.hash);
        } else {
            logger.warning('JWT token not available, skipping task verification for LP addition.', '⚠️');
        }
    } catch (error) {
        logger.error(`Liquidity Add ${index + 1} failed: ${error.message}`, '❌');
        if (error.transaction) {
            logger.error(`Transaction details: ${JSON.stringify(error.transaction, null, 2)}`, '🔍');
        }
        if (error.receipt) {
            logger.error(`Receipt: ${JSON.stringify(error.receipt, null, 2)}`, '📝');
        }
    }
};

const performCheckIn = async (wallet, proxy = null) => {
    try {
        logger.step(`Performing daily check-in for wallet: ${wallet.address}`);

        const message = "pharos"; // The message to sign
        const signature = await wallet.signMessage(message);
        logger.step(`Signed message: ${signature}`);

        const loginUrl = `https://api.pharosnetwork.xyz/user/login?address=${wallet.address}&signature=${signature}&invite_code=S6NGMzXSCDBxhnwo`;
        const headers = {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.8",
            authorization: "Bearer null", // Initial login usually doesn't require a token
            "sec-ch-ua": '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            Referer: "https://testnet.pharosnetwork.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "User-Agent": randomUseragent.getRandom(),
        };

        const axiosConfig = {
            method: 'post',
            url: loginUrl,
            headers,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        };

        const spinner = logger.loading('Sending login request to get JWT...');
        const loginResponse = await axios(axiosConfig);
        const loginData = loginResponse.data;

        if (loginData.code !== 0 || !loginData.data.jwt) {
            spinner.fail(`Login failed: ${loginData.msg || 'Unknown error'}`);
            return null;
        }

        const jwt = loginData.data.jwt;
        spinner.succeed(`Login successful, JWT obtained.`);

        const checkInUrl = `https://api.pharosnetwork.xyz/sign/in?address=${wallet.address}`;
        const checkInHeaders = {
            ...headers,
            authorization: `Bearer ${jwt}`, // Now use the obtained JWT for check-in
        };

        const checkInSpinner = logger.loading('Sending daily check-in request...');
        const checkInResponse = await axios({
            method: 'post',
            url: checkInUrl,
            headers: checkInHeaders,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        });
        const checkInData = checkInResponse.data;

        if (checkInData.code === 0) {
            checkInSpinner.succeed(`Daily check-in successful for ${wallet.address}`);
            return jwt;
        } else {
            checkInSpinner.warn(`Check-in failed, possibly already checked in: ${checkInData.msg || 'Unknown error'}`);
            return jwt; // Still return JWT even if check-in failed (might be already done)
        }
    } catch (error) {
        logger.error(`Check-in process failed for ${wallet.address}: ${error.message}`, '❌');
        if (error.response && error.response.status === 403) {
            logger.error('Received 403 Forbidden during check-in. This indicates an issue with authentication setup.', '🚨');
        }
        return null;
    }
};

const claimFaucet = async (wallet, proxy = null) => {
    try {
        logger.step(`Checking faucet eligibility for wallet: ${wallet.address}`);

        // Perform login to get JWT, as it's needed for faucet requests
        const jwt = await performCheckIn(wallet, proxy);
        if (!jwt) {
            logger.error('Failed to obtain JWT for faucet claim. Skipping faucet operations.', '❌');
            return false;
        }

        const headers = {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.8",
            authorization: `Bearer ${jwt}`, // Use the obtained JWT
            "sec-ch-ua": '"Chromium";v="136", "Brave";v="136", "Not.A/Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            Referer: "https://testnet.pharosnetwork.xyz/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "User-Agent": randomUseragent.getRandom(),
        };

        const statusUrl = `https://api.pharosnetwork.xyz/faucet/status?address=${wallet.address}`;
        const statusSpinner = logger.loading('Checking faucet status...');
        const statusResponse = await axios({
            method: 'get',
            url: statusUrl,
            headers: headers,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        });
        const statusData = statusResponse.data;

        if (statusData.code !== 0 || !statusData.data) {
            statusSpinner.fail(`Faucet status check failed: ${statusData.msg || 'Unknown error'}`);
            return false;
        }

        if (!statusData.data.is_able_to_faucet) {
            const nextAvailable = new Date(statusData.data.avaliable_timestamp * 1000).toLocaleString('en-US', { timeZone: 'Asia/Makassar' });
            statusSpinner.warn(`Faucet not available until: ${theme.warning(nextAvailable)}`);
            return false;
        }

        statusSpinner.succeed('Faucet is available!');
        const claimUrl = `https://api.pharosnetwork.xyz/faucet/daily?address=${wallet.address}`;
        const claimSpinner = logger.loading('Claiming faucet...');
        const claimResponse = await axios({
            method: 'post',
            url: claimUrl,
            headers: headers,
            httpsAgent: proxy ? new HttpsProxyAgent(proxy) : null,
        });
        const claimData = claimResponse.data;

        if (claimData.code === 0) {
            claimSpinner.succeed(`Faucet claimed successfully for ${wallet.address}`);
            return true;
        } else {
            claimSpinner.fail(`Faucet claim failed: ${claimData.msg || 'Unknown error'}`);
            return false;
        }
    } catch (error) {
        logger.error(`Faucet claim process failed for ${wallet.address}: ${error.message}`, '❌');
        if (error.response && error.response.status === 403) {
            logger.error('Received 403 Forbidden during faucet claim. This indicates an issue with authentication or faucet eligibility.', '🚨');
        }
        return false;
    }
};

const main = async () => {
    logger.banner();

    const config = await getConfiguration(); // Use the enhanced configuration menu
    
    logger.stats({
        'Delay (minutes)': config.delayMinutes,
        'Transfers per cycle': config.numTransfers,
        'Swaps per cycle': config.numSwaps,
        'Wraps per cycle': config.numWraps,
        'LP additions per cycle': config.numLPs
    });

    const proxies = loadProxies();
    const privateKeys = [process.env.PRIVATE_KEY_1, process.env.PRIVATE_KEY_2].filter(pk => pk);
    
    if (!privateKeys.length) {
        logger.error('No private keys found in .env file', '🔑');
        process.exit(1);
    }

    logger.info(`Loaded ${privateKeys.length} wallet(s)`, '👛');

    let cycleCount = 0;

    while (true) {
        cycleCount++;
        logger.section(`🚀 CYCLE ${cycleCount}`);

        for (let walletIndex = 0; walletIndex < privateKeys.length; walletIndex++) {
            const privateKey = privateKeys[walletIndex];
            const proxy = proxies.length ? getRandomProxy(proxies) : null;
            const provider = setupProvider(proxy);
            const wallet = new ethers.Wallet(privateKey, provider);

            logger.wallet(`Wallet ${walletIndex + 1}: ${wallet.address.slice(0, 10)}...${wallet.address.slice(-6)}`);

            let jwt = null; // Initialize JWT token for the current wallet

            try {
                // Faucet claim (which now includes login to get JWT)
                logger.section('💰 FAUCET & LOGIN');
                // The claimFaucet now also handles the initial login and JWT retrieval.
                // It will internally call performCheckIn to get the JWT.
                await claimFaucet(wallet, proxy); // This will update JWT state internally if successful

                // Re-fetch JWT after faucet to ensure it's up-to-date for other ops
                // or ensure claimFaucet can return the JWT directly.
                // For simplicity and directness, let's update performCheckIn to return JWT,
                // and then explicitly call it before getUserInfo and other tasks.
                logger.section('✅ RE-AUTHENTICATE & GET USER INFO');
                jwt = await performCheckIn(wallet, proxy); // Ensure we have the latest JWT

                if (jwt) {
                    await getUserInfo(wallet, proxy, jwt);
                } else {
                    logger.warning('Could not get JWT token after check-in. Skipping user info fetch and task verification for subsequent operations.', '⚠️');
                }

                // Transactions with progress bars
                const totalOperations = parseInt(config.numTransfers) + parseInt(config.numSwaps) + 
                                        parseInt(config.numWraps) + parseInt(config.numLPs);
                
                let completedOperations = 0;
                const overallProgress = new ModernProgressBar(totalOperations, '🔄 Overall Progress');

                // Transfers
                logger.section('💸 TRANSFERS');
                for (let i = 0; i < parseInt(config.numTransfers); i++) {
                    logger.step(`Performing transfer ${i + 1}...`);
                    await transferPHRS(wallet, provider, i, jwt, proxy); // Pass jwt for verification
                    completedOperations++;
                    overallProgress.update(completedOperations);
                }

                // Swaps
                logger.section('🔄 SWAPS');
                for (let i = 0; i < parseInt(config.numSwaps); i++) {
                    logger.step(`Performing swap ${i + 1}...`);
                    await performSwap(wallet, provider, i, jwt, proxy); // Pass jwt for verification
                    completedOperations++;
                    overallProgress.update(completedOperations);
                }

                // Wraps
                logger.section('📦 WRAPS');
                for (let i = 0; i < parseInt(config.numWraps); i++) {
                    logger.step(`Performing wrap ${i + 1}...`);
                    await wrapPHRS(wallet, provider, i, jwt, proxy); // Pass jwt for verification
                    completedOperations++;
                    overallProgress.update(completedOperations);
                }

                // LP Additions
                logger.section('🏊 LP ADDITIONS');
                for (let i = 0; i < parseInt(config.numLPs); i++) {
                    logger.step(`Performing LP addition ${i + 1}...`);
                    await addLiquidity(wallet, provider, i, jwt, proxy); // Pass jwt for verification
                    completedOperations++;
                    overallProgress.update(completedOperations);
                }

                overallProgress.stop();
                logger.success(`All operations for wallet ${walletIndex + 1} completed! ✅`);

            } catch (walletError) {
                logger.error(`Error processing wallet ${wallet.address}: ${walletError.message}`, '❌');
            }
        } // End of for loop for privateKeys

        logger.info(`Cycle ${cycleCount} completed. Entering delay of ${config.delayMinutes} minutes.`, '⏳');
        await modernCountdown(parseInt(config.delayMinutes));
    } // End of while(true)
};

// Start the main execution flow
main().catch(error => {
    logger.error(`Main execution error: ${error.message}`, '🔥');
    process.exit(1);
});
