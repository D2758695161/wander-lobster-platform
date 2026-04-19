# Running a Midnight Node: Complete Setup, Sync & Monitoring Guide

> **Tier 3 Bounty Tutorial** — Contributor Hub Issue [#323](https://github.com/midnightntwrk/contributor-hub/issues/323)  
> Platform: Dev.to | Tags: `#MidnightforDevs`  
> Author: Community Contributor

---

## Table of Contents

1. [What is a Midnight Node?](#1-what-is-a-midnight-node)
2. [Prerequisites & System Requirements](#2-prerequisites--system-requirements)
3. [Installing the Midnight Node](#3-installing-the-midnight-node)
4. [Configuration](#4-configuration)
5. [Starting Your Node](#5-starting-your-node)
6. [Initial Sync Process](#6-initial-sync-process)
7. [Block Height Monitoring](#7-block-height-monitoring)
8. [Peer Connectivity & Troubleshooting](#8-peer-connectivity--troubleshooting)
9. [Resource Requirements](#9-resource-requirements)
10. [Verifying Node Health](#10-verifying-node-health)
11. [Staying Synced & Maintenance](#11-staying-synced--maintenance)

---

## 1. What is a Midnight Node?

A Midnight node is the foundational infrastructure for participating in the Midnight network — a privacy-first blockchain that blends public verifiability with confidential data handling using zero-knowledge (ZK) proofs.

Midnight implements the MimbleWimble protocol and operates as a **Cardano Partnerchain**. This means your Midnight node also maintains a connection to Cardano, enabling cross-chain operations while preserving privacy.

### What a Midnight Node Does

- **Runs the Midnight Ledger** — enforces protocol rules and maintains internal state integrity
- **Enables P2P networking** — handles node discovery, peer connections, and state gossip
- **Supports decentralization** — works as either a trustless (registered) or permissioned node
- **Participates in consensus** — co-signs blocks alongside other validators

### Node Types

| Type | Description |
|------|-------------|
| **Validator Node** | Participates in block production and consensus. Requires stake. |
| **Full Node** | Syncs the full blockchain, verifies all transactions, relays blocks. |
| **Archive Node** | Stores the complete history (for indexing/analytics). Requires more storage. |

This guide covers **running a full node** — the most common type for developers, node operators, and DApp hosts.

---

## 2. Prerequisites & System Requirements

### Hardware Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| **CPU** | 4 cores | 8+ cores |
| **RAM** | 8 GB | 16 GB DDR4+ |
| **Storage** | 100 GB SSD | 500 GB NVMe SSD |
| **Network** | 10 Mbps stable | 100 Mbps symmetric |

> ⚠️ **Note:** During initial sync, storage usage grows quickly. Use SSD over HDD — HDD will fall behind and fail to sync properly.

### Software Requirements

- **OS:** Linux (Ubuntu 20.04+), macOS (Intel/Apple Silicon), or Windows (WSL2 recommended)
- **Docker** (recommended) or native binary
- **curl / wget** for downloading binaries
- **OpenSSL** (usually pre-installed)

### Account Setup

Before starting, you'll need:

1. A **wallet key pair** (sr25519 public key) for your node's identity
2. Optional: **Stake credentials** if you plan to run a validator

---

## 3. Installing the Midnight Node

### Option A: Using Docker (Recommended)

Docker is the easiest way to run Midnight node without dealing with dependencies.

```bash
# Pull the official Midnight node image
docker pull midnightntwrk/midnight-node:latest

# Create a directory for persistent data
mkdir -p ~/midnight/data

# Start the node
docker run -d \
  --name midnight-node \
  -p 3033:3033 \
  -p 9933:9933 \
  -v ~/midnight/data:/data \
  midnightntwrk/midnight-node:latest \
  midnight-node \
  --chain testnet \
  --base-path /data \
  --name "My-Midnight-Full-Node"
```

### Option B: Binary Installation (Linux/macOS)

```bash
# Download the latest Midnight node binary
curl -L https://github.com/midnightntwrk/midnight-node/releases/latest/download/midnight-node-linux-x86_64.tar.gz \
  -o midnight-node.tar.gz

# Extract
tar -xzf midnight-node.tar.gz
chmod +x midnight-node
sudo mv midnight-node /usr/local/bin/

# Verify installation
midnight-node --version
```

### Option C: Building from Source

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Clone the Midnight node repository
git clone https://github.com/midnightntwrk/midnight-node.git
cd midnight-node

# Build the release binary
cargo build --release

# Binary will be at target/release/midnight-node
```

---

## 4. Configuration

Midnight node uses a **chain specification file** and command-line flags for configuration.

### Generate a New Node Key

Every node needs a unique identity key:

```bash
midnight-node key generate \
  --scheme sr25519 \
  --output ~/midnight/keys/node_key.json
```

### Create a Configuration File

```bash
mkdir -p ~/midnight/config
```

Create `~/midnight/config/node.toml`:

```toml
[metadata]
chain = "testnet"
node_name = "My-Midnight-Full-Node"
log_level = "info"

[network]
port = 3033
bootnodes = [
  "/dnsaddr/bootnode-1.testnet.midnight.network/tcp/30333/p2p/12D3KooWH2...",
  "/dnsaddr/bootnode-2.testnet.midnight.network/tcp/30333/p2p/12D3KooWH3..."
]
max_connections = 200

[rpc]
port = 9933
cors = ["http://localhost:*"]
methods = ["unsafe", "state_trieStorage"]

[database]
path = "/data/chains/testnet/db"

[state_cache]
size = "2GB"

[compilation]
wasm_runtime_overrides = "https://github.com/midnightntwrk/runtime/releases"
```

### Testnet vs Mainnet

| Parameter | Testnet | Mainnet |
|-----------|---------|---------|
| Chain Spec | `--chain testnet` | `--chain mainnet` |
| Bootnodes | Testnet bootnodes | Mainnet bootnodes |
| RPC Port | 9933 | 9933 (or custom) |

> ⚠️ **Important:** Never use testnet configuration on mainnet. Always double-check your `--chain` flag.

---

## 5. Starting Your Node

### Basic Start Command

```bash
midnight-node \
  --chain testnet \
  --base-path ~/midnight/data \
  --port 3033 \
  --rpc-port 9933 \
  --name "My-Midnight-Full-Node" \
  --rpc-methods unsafe \
  --log info
```

### With Systemd (Linux Production Setup)

Create a systemd service for automatic restart:

```ini
# /etc/systemd/system/midnight-node.service
[Unit]
Description=Midnight Node
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=midnight
Group=midnight
ExecStart=/usr/local/bin/midnight-node \
  --chain testnet \
  --base-path /home/midnight/data \
  --port 3033 \
  --rpc-port 9933 \
  --name "My-Midnight-Full-Node" \
  --rpc-methods unsafe
Restart=always
RestartSec=10
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable midnight-node
sudo systemctl start midnight-node

# Check status
sudo systemctl status midnight-node
```

### Verify Node is Running

```bash
# Check logs
journalctl -u midnight-node -f

# Check via RPC (see Section 7 for full monitoring)
curl -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
  http://localhost:9933/rpc
```

Expected output:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "peers": 5,
    "isSyncing": true,
    "shouldHavePeers": true
  },
  "id": 1
}
```

---

## 6. Initial Sync Process

### Understanding the Sync

When you first start a Midnight node, it must download and verify the entire blockchain history from other peers. This is called **catching up** or **syncing**.

**Block time:** 6 seconds per block  
**Session length:** 1200 slots

### Monitoring Sync Progress

Use the RPC endpoint to track sync status:

```bash
curl -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"sync_state","params":[],"id":1}' \
  http://localhost:9933/rpc
```

Or watch the logs in real-time:

```bash
# On Docker
docker logs -f midnight-node

# On native binary
tail -f ~/midnight/data/logs/midnight.log
```

### Sync Log Indicators

You'll see messages like these during sync:

```
🟡 Syncing: imported X blocks, now at #12,345 / 67,890 (18.2%)
💤 Waiting for peers... (0/3 connected)
🟢 State: downloading state
✅ Sync complete: at block #67,890
```

### What Happens During Sync

1. **State download** — Node fetches the current state trie from peers
2. **Block import** — Historical blocks are verified and replayed
3. **WASM runtime** — Contract runtime is compiled/verified
4. **Peer establishment** — At least 1-3 healthy peers must be connected

### Sync Time Estimates

| Storage Type | Approximate Sync Time |
|-------------|----------------------|
| NVMe SSD (fresh) | 30–60 minutes |
| SATA SSD (fresh) | 2–4 hours |
| HDD (not recommended) | 12+ hours or stuck |

> 💡 **Tip:** If sync is stuck, see Section 8 (Troubleshooting).

---

## 7. Block Height Monitoring

### Using RPC

```bash
# Get current block number
curl -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"chain_getBlock","params":[],"id":1}' \
  http://localhost:9933/rpc
```

```json
{
  "jsonrpc": "2.0",
  "result": {
    "block": {
      "header": {
        "number": "0x8f2a",  // Decimal: 36,650
        "stateRoot": "0x...",
        "extrinsicsRoot": "0x...",
        "digest": { "logs": [] }
      }
    }
  },
  "id": 1
}
```

### Using Prometheus Metrics

Enable Prometheus metrics endpoint:

```bash
midnight-node \
  ... \
  --prometheus-port 9615 \
  --metrics-interval 5
```

Now scrape it with Prometheus or view directly:

```bash
curl http://localhost:9615/metrics
```

Key metrics to watch:

```
# HELP midnight_block_height Current block height
# TYPE midnight_block_height gauge
midnight_block_height 67890

# HELP midnight_peers_connected Number of connected peers
# TYPE midnight_peers_connected gauge
midnight_peers_connected 5

# HELP midnight_syncing Is the node currently syncing (1=yes, 0=no)
# TYPE midnight_syncing gauge
midnight_syncing 1
```

### Simple Monitoring Script

Save as `monitor.sh`:

```bash
#!/bin/bash
RPC_URL="http://localhost:9933/rpc"

while true; do
  HEIGHT=$(curl -s -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"chain_getBlock","params":[],"id":1}' \
    $RPC_URL | jq '.result.block.header.number' | printf "0x%s" $(cat) | xargs printf "%d")

  PEERS=$(curl -s -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
    $RPC_URL | jq '.result.peers')

  SYNCING=$(curl -s -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"sync_state","params":[],"id":1}' \
    $RPC_URL | jq '.result.currentBlock')

  clear
  echo "=========================================="
  echo "  Midnight Node Monitor"
  echo "=========================================="
  echo "  Block Height: $HEIGHT"
  echo "  Connected Peers: $PEERS"
  echo "  Syncing To: $SYNCING"
  echo "=========================================="
  sleep 5
done
```

Run it:
```bash
chmod +x monitor.sh
./monitor.sh
```

---

## 8. Peer Connectivity & Troubleshooting

### Problem: Node Stuck on Block 1

This is the most common issue. It means your node isn't receiving blocks from peers.

**Diagnosis:**

```bash
curl -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
  http://localhost:9933/rpc
```

If `peers: 0` or very low, the problem is networking.

**Solutions:**

1. **Check your firewall / port:**
   ```bash
   # Verify port 3033 is open and listening
   ss -tlnp | grep 3033
   # Should show: LISTEN on 0.0.0.0:3033 or :::3033
   ```

2. **Check external connectivity:**
   ```bash
   # Test if others can reach you
   curl https://api.ipify.org
   # Make sure your router/machine is reachable on port 3033
   ```

3. **Add known good bootnodes manually:**
   ```bash
   midnight-node \
     --chain testnet \
     --bootnodes /dnsaddr/bootnode-1.testnet.midnight.network/tcp/30333/p2p/12D3KooWH2sLGYTV3t2MShD9ZJjWTf7Zj9AKKpWXCz5E3mU3pB8a
   ```

4. **Check if your ISP blocks P2P** — Some residential ISPs throttle P2P connections. Try a VPN or cloud VPS.

### Problem: Peers Connect but Disconnect Immediately

```log
💔 Block request to peer X timed out
💔 Peer disconnected: 12D3KooWH2...
```

**Solutions:**

1. **Check your clock is synchronized:**
   ```bash
   # Linux
   timedatectl status
   # Should show: System clock synchronized: yes

   # macOS
   sudo sntp -sS time.apple.com
   ```

2. **Increase peer timeout in config:**
   ```toml
   [network]
   peer_timeout = 30  # seconds, increase from default
   ```

3. **Update to latest node version** — old versions had broken peer ping/pong.

### Problem: WASM Runtime Fails to Compile

```log
Failed to compile WASM runtime: out of memory
```

**Solution:** Allocate more memory to the node process:

```bash
# Docker: increase memory limit
docker run -d \
  --name midnight-node \
  --memory="8g" \
  --memory-swap="8g" \
  ... rest of args ...
```

```bash
# Or run with JVM-like heap (if using JVM-based runtime)
RUST_MIN_STACK=8388608 midnight-node ...
```

### Problem: Database Corruption

```log
Database integrity check failed at block #12345
```

**Solution:** Wipe and resync the database:

```bash
# Stop the node
sudo systemctl stop midnight-node

# Wipe the database
rm -rf ~/midnight/data/chains/testnet/db
rm -rf ~/midnight/data/chains/testnet/network

# Restart
sudo systemctl start midnight-node
```

> ⚠️ **Warning:** Never delete `keys/` directory — only the `chains/` and `network/` directories.

### Network Connectivity Checklist

- [ ] Port 3033 (P2P) is open and reachable externally
- [ ] Port 9933 (RPC) is bound to localhost only (not exposed publicly!)
- [ ] System clock is synchronized with NTP
- [ ] Firewall allows outgoing TCP/UDP to port 30333
- [ ] No ISP-level P2P throttling
- [ ] Node has a publicly routable IP (not behind double-NAT)

---

## 9. Resource Requirements

### CPU

Midnight nodes benefit from **single-threaded performance** for block verification, but also use multi-core for parallel transaction validation and WASM compilation.

| Node Type | Min CPU | Notes |
|-----------|---------|-------|
| Full Node | 4 cores @ 2.5 GHz | Intel i5 / AMD Ryzen 5 equivalent |
| Validator | 8 cores @ 3.0 GHz+ | Heaviest during block production |
| Archive Node | 8+ cores | + full history processing |

### RAM

```bash
# Check memory usage of your node
# Docker
docker stats midnight-node

# Native
ps aux | grep midnight-node
```

| Node Type | Min RAM | Typical |
|-----------|---------|---------|
| Full Node | 8 GB | 10–12 GB |
| Validator | 16 GB | 20–24 GB |
| Archive Node | 32 GB | 40+ GB |

**Linux memory tuning:**
```bash
# Increase in-memory state cache
echo 'net.core.rmem_max = 124928000' | sudo tee -a /etc/sysctl.conf
echo 'net.core.wmem_max = 124928000' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### Storage

The Midnight blockchain grows over time. As of 2026, a full testnet node uses approximately **50–80 GB**.

```bash
# Check disk usage
du -sh ~/midnight/data/chains/testnet/db

# Monitor disk I/O
iostat -x 1
```

**Storage recommendations:**
- Use **NVMe SSD** for fastest block import
- Leave at least **20% free space** on the drive
- Consider **LVM** or a separate partition for easy expansion
- Enable **TRIM** support for SSDs

### Network

| Metric | Minimum | Recommended |
|--------|---------|-------------|
| Bandwidth | 10 Mbps up/down | 100 Mbps symmetric |
| Monthly cap | 500 GB | Unlimited |
| Latency to peers | < 200ms | < 50ms |

**Bandwidth usage estimate:**
- Initial sync: ~20–50 GB download
- Ongoing sync: ~1–5 GB/day (depending on network activity)

---

## 10. Verifying Node Health

### Health Check Script

```bash
#!/bin/bash
RPC="http://localhost:9933/rpc"
FAIL=0

echo "=== Midnight Node Health Check ==="

# 1. Check if node is responding
HEALTH=$(curl -s -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"system_health","params":[],"id":1}' \
  $RPC | jq -r '.result')

PEERS=$(echo $HEALTH | jq '.peers')
SYNCING=$(echo $HEALTH | jq '.isSyncing')
SHOULD_HAVE=$(echo $HEALTH | jq '.shouldHavePeers')

echo "1. Peers connected: $PEERS"
[ "$PEERS" -lt 1 ] && { echo "   ❌ FAIL: No peers connected"; FAIL=1; } || echo "   ✅ OK"

echo "2. Is syncing: $SYNCING"
[ "$SYNCING" = "true" ] && echo "   ℹ️  INFO: Node is still syncing" || echo "   ✅ OK: Node is synced"

echo "3. Should have peers: $SHOULD_HAVE"
[ "$SHOULD_HAVE" = "true" ] && [ "$PEERS" -lt 1 ] && { echo "   ❌ FAIL: Should have peers but doesn't"; FAIL=1; }

# 4. Check block height
HEIGHT=$(curl -s -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"chain_getBlock","params":[],"id":1}' \
  $RPC | jq -r '.result.block.header.number' | head -c 20)
echo "4. Current block height: $HEIGHT"

# 5. Check runtime version
RUNTIME=$(curl -s -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"state_getRuntimeVersion","params":[],"id":1}' \
  $RPC | jq -r '.result.specName')
echo "5. Chain spec: $RUNTIME"

echo ""
if [ $FAIL -eq 0 ]; then
  echo "✅ All checks passed — node appears healthy"
else
  echo "❌ Some checks failed — review logs and peer connectivity"
fi
```

### Key Health Indicators

| Indicator | Healthy | Warning | Critical |
|-----------|---------|---------|----------|
| **Peer count** | 3–10 | 1–2 | 0 |
| **Block height** | Increasing | Frozen | 0 / not increasing |
| **Sync status** | `false` (synced) | `true` (syncing) | Error |
| **Memory usage** | < 80% RAM | 80–95% RAM | > 95% RAM |
| **Disk usage** | < 70% | 70–85% | > 85% |
| **CPU load** | < 60% | 60–90% | > 90% sustained |

### When to Be Concerned

🚨 **Contact the Midnight team or community if:**
- Node has been stuck at the same block for > 30 minutes with 3+ peers
- Peers keep connecting and disconnecting in a loop
- Database keeps corrupting after rebuilds
- You're on an older version and can't sync past a certain block

Resources:
- **Discord:** https://discord.com/invite/midnightnetwork
- **Forum:** https://forum.midnight.network/
- **Docs:** https://docs.midnight.network/

---

## 11. Staying Synced & Maintenance

### Keeping Your Node Updated

```bash
# Check current version
midnight-node --version

# Pull latest Docker image
docker pull midnightntwrk/midnight-node:latest

# Or download new binary and restart
curl -L https://github.com/midnightntwrk/midnight-node/releases/latest/download/midnight-node-linux-x86_64.tar.gz
tar -xzf midnight-node.tar.gz
sudo systemctl stop midnight-node
sudo mv midnight-node /usr/local/bin/
sudo systemctl start midnight-node
```

### Database Pruning (Reduce Storage)

```bash
# Enable state pruning to reduce storage by ~60%
midnight-node \
  --chain testnet \
  --pruning=1000 \
  --state-cache-size=2 \
  ...
```

### Backup Your Node Keys

```bash
# Back up your keys directory
tar -czf midnight-keys-backup-$(date +%Y%m%d).tar.gz ~/midnight/keys/

# Store the backup securely (offline/cold storage)
# Your keys control your node identity — losing them means losing your node's reputation
```

### Upgrading Node Without Downtime

```bash
# Use systemctl to do a zero-downtime restart
sudo systemctl restart midnight-node

# The node will briefly be unreachable for ~5–10 seconds during restart
# For true zero-downtime, use a load balancer with health-check in front of multiple nodes
```

---

## Summary Checklist

Before going live, verify each of these:

- [ ] Node installed and binary verified (`--version` works)
- [ ] Unique node key generated and backed up
- [ ] Configuration file created (`node.toml`)
- [ ] Port 3033 open externally, 9933 bound to localhost
- [ ] Node starts and connects to at least 1 peer
- [ ] Block height increases over time
- [ ] `system_health` RPC returns `isSyncing: false`
- [ ] Prometheus metrics endpoint responds
- [ ] Systemd service set up for auto-restart
- [ ] Monitoring script running (optional but recommended)
- [ ] Keys backed up to secure storage

---

## References

- Midnight Docs: https://docs.midnight.network/
- Getting Started: https://docs.midnight.network/getting-started
- Node Overview: https://docs.midnight.network/nodes
- Midnight GitHub: https://github.com/midnightntwrk
- Discord: https://discord.com/invite/midnightnetwork
- Developer Forum: https://forum.midnight.network/

---

*This tutorial was written for the Midnight Contributor Hub bounty program. Code examples should be tested before use on production networks. Always verify you are using the latest node binary and testnet configuration.*
