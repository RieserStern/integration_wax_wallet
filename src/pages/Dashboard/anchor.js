
const identifier = 'Crowd';
const transport = new AnchorLinkBrowserTransport();
const link = new AnchorLink({
    transport,
    chains: [{
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
        nodeUrl: 'https://eos.greymass.com',
    }]
});
// the session instance, either restored using link.restoreSession() or created with link.login()
let session

// tries to restore session, called when document is loaded
function restoreSession() {
    link.restoreSession(identifier).then((result) => {
        session = result
        if (session) {
            didLogin()
        }
    })
}

// login and store session if sucessful
function login() {
    link.login(identifier).then((result) => {
        session = result.session
        didLogin()
    })
}

// logout and remove session from storage
function logout() {
    document.body.classList.remove('logged-in')
    session.remove()
}

// called when session was restored or created
function didLogin() {
    document.getElementById('account-name').textContent = session.auth.actor
    document.body.classList.add('logged-in')
}

// transfer tokens using a session
// function transfer() {
//     const action = {
//         account: 'eosio.token',
//         name: 'transfer',
//         authorization: [session.auth],
//         data: {
//             from: session.auth.actor,
//             to: 'teamgreymass',
//             quantity: '0.0001 EOS',
//             memo: 'Anchor is the best! Thank you <3'
//         }
//     }
//     session.transact({ action }).then((result) => {
//         document.getElementById('log').innerHTML += `Transaction broadcast! ${result.processed.id}\n`
//     })
// }

// // ¯\_(ツ)_/¯
// window.addEventListener('keypress', (event) => {
//     if (session && (event.key === 'F' || event.key === 'f')) {
//         transfer()
//     }
// })
