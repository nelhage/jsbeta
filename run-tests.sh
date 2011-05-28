#!/bin/bash
BEMU="node main.js"
OPTIONS=""
NONDET=0        # Set for tests that are nondeterministic
FAIL=

run_one() {
    file="$1"

    run=$($BEMU "tests/$file.bin" 2>&1)

    shift
    while [ $# -gt 0 ]; do
        expect="$1"
        shift
        if ! echo "$run" | grep -qF "$expect"; then
            echo "[$file] FAIL: Expecting: '$expect'" >&2
            echo "$run";
            exit 1;
        fi
    done

    echo "[$file] OK"
}

run_one sancheck "[00] 800003b8 [01] 00000718 [02] 00000718 [03] 00000718"
run_one litmus   'All tests PASSED!'
run_one bench1   "[00] 00000001 [01] 00000367 [02] 00000001 [03] 00000367"
run_one bench2   "[80000048] Done" "[00] 00000001 [01] 00000000 [02] 00000000 [03] 00000000"
run_one bench3   "[80000c38] Done" "[28] 80000c3c [29] 00000000 [30] 00000000 [31] 00000000"
run_one bench4   "[00] 991727a0 [01] 5096a491 [02] 00000000 [03] 00000000"
run_one supervisor "[00] ffffabcd"
run_one align    "[00] ffffabcd"
run_one qsort    "[00] 00001111"
run_one jmptab   "[00] 00000007" "Hello."
run_one trap     "Invalid read"
