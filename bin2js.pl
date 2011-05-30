#!/usr/bin/env perl
use strict;
use warnings;

use File::Basename;

my $data = do {local $/; <>};
my $name = basename($ARGV);
my @values = unpack("L<*", $data);

$name =~ s{\.bin$}{};

print "var ${name}_rom = [\n";
for my $b (@values) {
    printf "  0x%08x, \n", $b;
}
print "  0x00000000\n];\n";
