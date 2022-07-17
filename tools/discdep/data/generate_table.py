import io
import json
import os

import utils


RELATIONS = [
    "ROOT",
    "ADDITION",
    "ELABORATION",
    "COMPARISON",
    "CAUSE-RESULT",
    "CONDITION",
    "TEMPORAL",
    "ENABLEMENT",
    "MANNER-MEANS",
    "BACKGROUND",
    "VERIFICATION",
    "CONCLUSION",
    "ATTRIBUTION",
    "TEXTUAL-ORGANIZATION",
    "SAME-UNIT",
    # "SEGMENTATION-ERROR",
]


def main():
    filenames = utils.read_lines("./examples.txt")
    filenames.sort()

    table = {r: [] for r in RELATIONS}
    for filename in filenames:
        table = update_table(table, "./examples", filename)

    with open("./examples.csv", "w") as f:
        for rel in RELATIONS:
            names = list(set(table[rel]))
            names.sort()
            line = ",".join([rel] + names)
            f.write("%s\n" % line)


def update_table(table, dir_path, filename):
    with io.open(os.path.join(dir_path, filename), encoding="utf_8_sig") as f:
        line = f.read()
        data = json.loads(line)
    for edu in data["root"]:
        # head = edu["parent"]
        # dep = edu["id"]
        rel = edu["relation"]
        if rel == "null":
            continue
        table[rel].append(filename)
    return table


if __name__ == "__main__":
    main()

