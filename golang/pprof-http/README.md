# pprof

## Installation
1. install [go-wrk](https://github.com/tsliwowicz/go-wrk)
   ```
   go install github.com/tsliwowicz/go-wrk@latest
   ```
2. install [go-torch](https://github.com/uber-archive/go-torch)
   ```
   go install github.com/uber/go-torch@latest
   ```

   ```
   git clone https://github.com/brendangregg/FlameGraph.git
   ```
   ```
   export PATH=<path to FlameGraph>:$PATH 
   ```
3. start http service
   ```
   go rum main.go
   ```
4. load the http service
   ```
   go-wrk -c 80 -d 20 http://localhost:8080/
   ```
5. pprof

```
$ go tool pprof -seconds 5 http://localhost:8080/debug/pprof/profile
Fetching profile over HTTP from http://localhost:8080/debug/pprof/profile?seconds=5
Please wait... (5s)
...
Type: cpu
Time: May 11, 2023 at 2:54am (JST)
Duration: 5.11s, Total samples = 8.35s (163.56%)
Entering interactive mode (type "help" for commands, "o" for options)
(pprof) top10
Showing nodes accounting for 7.87s, 94.25% of 8.35s total
Dropped 141 nodes (cum <= 0.04s)
Showing top 10 nodes out of 76
      flat  flat%   sum%        cum   cum%
     7.06s 84.55% 84.55%      7.07s 84.67%  syscall.syscall
     0.48s  5.75% 90.30%      0.48s  5.75%  runtime.pthread_cond_wait
     0.16s  1.92% 92.22%      0.16s  1.92%  runtime.pthread_cond_signal
     0.13s  1.56% 93.77%      0.13s  1.56%  runtime.kevent
     0.03s  0.36% 94.13%      0.07s  0.84%  runtime.mallocgc
     0.01s  0.12% 94.25%      0.10s  1.20%  runtime.wakep
         0     0% 94.25%      0.95s 11.38%  bufio.(*Reader).Peek
         0     0% 94.25%      0.95s 11.38%  bufio.(*Reader).fill
         0     0% 94.25%      1.31s 15.69%  bufio.(*Writer).Flush
         0     0% 94.25%      0.05s   0.6%  fmt.(*pp).doPrintf
```
6. go-torch

```
$ go-torch --time 5 --url http://localhost:8080/debug/pprof/profile
INFO[03:13:14] Run pprof command: go tool pprof -raw -seconds 5 http://localhost:8080/debug/pprof/profile
INFO[03:13:20] Writing svg to torch.svg
```
