// Particles configuration
particlesJS('particles-js', {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 1000
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "star",
            stroke: {
                width: 0,
                color: "#ffffff"
            },
            polygon: {
                nb_sides: 5
            }
        },
        opacity: {
            value: 0.8,
            random: true,
            anim: {
                enable: true,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 2,
            random: true,
            anim: {
                enable: true,
                speed: 2,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: false
        },
        move: {
            enable: true,
            speed: 0.5,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "bubble"
            },
            resize: true
        },
        modes: {
            bubble: {
                distance: 100,
                size: 4,
                duration: 2,
                opacity: 1,
                speed: 3
            }
        }
    },
    retina_detect: true
});

// Using Solana Wallet Adapter
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
  const RECIPIENT_WALLET = '7xW5Uv9sc4FjiaEWYtftP8R8pr5awykaxmvic4aP2LHV';
  const AMOUNT_USD = 0.01;

  async function sendSolPayment(wallet) {
      try {
          // Get current SOL price in USD
          const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
          const data = await response.json();
          const solPrice = data.solana.usd;
        
          // Calculate SOL amount based on USD value
          const solAmount = AMOUNT_USD / solPrice;
        
          // Create transaction
          const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta'));
          const transaction = new web3.Transaction().add(
              web3.SystemProgram.transfer({
                  fromPubkey: wallet.publicKey,
                  toPubkey: new web3.PublicKey(RECIPIENT_WALLET),
                  lamports: solAmount * web3.LAMPORTS_PER_SOL
              })
          );

          // Send transaction
          const signature = await wallet.signAndSendTransaction(transaction);
          await connection.confirmTransaction(signature);
          return true;
      } catch (error) {
          console.error(error);
          return false;
      }
  }

  // Box click handler
  document.querySelectorAll('.box').forEach(box => {
      box.addEventListener('click', async () => {
          if (!window.solana) {
              alert('Please connect your wallet first!');
              return;
          }
        
          // Process payment first
          const paymentSuccess = await sendSolPayment(window.solana);
          if (!paymentSuccess) {
              alert('Payment failed! Please try again.');
              return;
          }

          // Continue with box animation and reveal
          box.style.animation = 'spin 1s ease';
          setTimeout(() => {
              box.innerHTML = '<img src="https://media.tenor.com/hPGjq_IqmekAAAAj/unicorn-poop-pile-of-poo.gif" class="poop-gif">';
              box.style.animation = '';
          }, 1000);
      });
  });
// Check for Phantom on page load
window.addEventListener('load', () => {
    // Auto-detect if Phantom is already connected
    if (window.solana?.isPhantom) {
        checkIfWalletIsConnected();
    }
});

const checkIfWalletIsConnected = async () => {
    try {
        const { solana } = window;
        if (solana) {
            if (solana.isPhantom) {
                const response = await solana.connect({ onlyIfTrusted: true });
                console.log(
                    'Connected with Public Key:',
                    response.publicKey.toString()
                );
                updateConnectedState();
            }
        }
    } catch (error) {
        console.log("User needs to connect manually");
    }
};

const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
        const response = await solana.connect();
        console.log('Connected with Public Key:', response.publicKey.toString());
        updateConnectedState();
    }
};

const updateConnectedState = () => {
    const connectButton = document.querySelector('.connect-wallet');
    connectButton.textContent = 'Connected';
    connectButton.classList.add('connected');
    document.querySelectorAll('.box').forEach(box => {
        box.style.pointerEvents = 'auto';
    });
};

// Add click listener
document.querySelector('.connect-wallet').addEventListener('click', async () => {
    if (!window.solana) {
        window.open('https://phantom.app/', '_blank');
        return;
    }
    await connectWallet();
});
