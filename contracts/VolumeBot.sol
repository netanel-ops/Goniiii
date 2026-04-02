// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params)
        external
        payable
        returns (uint256 amountOut);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract VolumeBot {
    address public owner;
    ISwapRouter public immutable swapRouter;
    address public immutable WETH;
    
    event BotExecuted(address indexed token, uint256 cycles, uint256 amountPerTrade, bool success);
    event TradeExecuted(address indexed token, bool isBuy, uint256 amount, uint256 timestamp);
    
    constructor(address _swapRouter, address _weth) {
        owner = msg.sender;
        swapRouter = ISwapRouter(_swapRouter);
        WETH = _weth;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    /**
     * @notice Execute volume bot - Buy and Sell in a loop
     * @param token Token address to trade
     * @param cycles Number of buy+sell cycles
     * @param amountPerTrade Amount of ETH per trade
     * @param fee Pool fee (3000 = 0.3%, 10000 = 1%)
     */
    function executeBot(
        address token,
        uint256 cycles,
        uint256 amountPerTrade,
        uint24 fee
    ) external payable onlyOwner {
        require(msg.value >= amountPerTrade * cycles, "Insufficient ETH");
        require(cycles > 0 && cycles <= 50, "Invalid cycles");
        
        // Approve token for router if not already approved
        IERC20 tokenContract = IERC20(token);
        uint256 currentAllowance = tokenContract.balanceOf(address(this));
        if (currentAllowance == 0) {
            tokenContract.approve(address(swapRouter), type(uint256).max);
        }
        
        for (uint256 i = 0; i < cycles; i++) {
            // BUY: ETH -> Token
            try this.buyToken(token, amountPerTrade, fee) {
                emit TradeExecuted(token, true, amountPerTrade, block.timestamp);
            } catch {
                emit BotExecuted(token, i, amountPerTrade, false);
                break;
            }
            
            // SELL: Token -> ETH
            uint256 tokenBalance = tokenContract.balanceOf(address(this));
            if (tokenBalance > 0) {
                try this.sellToken(token, tokenBalance, fee) {
                    emit TradeExecuted(token, false, tokenBalance, block.timestamp);
                } catch {
                    emit BotExecuted(token, i, amountPerTrade, false);
                    break;
                }
            }
        }
        
        // Return remaining ETH to owner
        uint256 remainingETH = address(this).balance;
        if (remainingETH > 0) {
            payable(owner).transfer(remainingETH);
        }
        
        // Return remaining tokens to owner
        uint256 remainingTokens = tokenContract.balanceOf(address(this));
        if (remainingTokens > 0) {
            tokenContract.transfer(owner, remainingTokens);
        }
        
        emit BotExecuted(token, cycles, amountPerTrade, true);
    }
    
    /**
     * @notice Buy token with ETH
     */
    function buyToken(
        address token,
        uint256 amountETH,
        uint24 fee
    ) external onlyOwner returns (uint256) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: WETH,
                tokenOut: token,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 600,
                amountIn: amountETH,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle{value: amountETH}(params);
    }
    
    /**
     * @notice Sell token for ETH
     */
    function sellToken(
        address token,
        uint256 amountToken,
        uint24 fee
    ) external onlyOwner returns (uint256) {
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: token,
                tokenOut: WETH,
                fee: fee,
                recipient: address(this),
                deadline: block.timestamp + 600,
                amountIn: amountToken,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        return swapRouter.exactInputSingle(params);
    }
    
    /**
     * @notice Emergency withdraw ETH
     */
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @notice Emergency withdraw tokens
     */
    function withdrawToken(address token) external onlyOwner {
        IERC20 tokenContract = IERC20(token);
        uint256 balance = tokenContract.balanceOf(address(this));
        require(balance > 0, "No tokens");
        tokenContract.transfer(owner, balance);
    }
    
    receive() external payable {}
}
