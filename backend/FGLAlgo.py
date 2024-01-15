import sqlite3
import random
import sys



def analyze_chat(desiredChatName):
    if desiredChatName == "":
        print("Error: Please enter a group chat name. Also, make sure your uploaded file is titled \"chat.db\"")
        return
    # Connect to the database
    connection = sqlite3.connect('assets/chat.db') 
    # Create a cursor object
    cursor = connection.cursor()

    # Execute SQL queries
    
    cursor.execute("SELECT display_name FROM chat WHERE display_name != '';")
    
    groupchats = cursor.fetchall()

    cursor.execute("DROP TABLE IF EXISTS GroupMsgs")
    cursor.execute("""
        CREATE TABLE GroupMsgs AS
        SELECT *
        FROM message 
        WHERE cache_roomnames IN (
            SELECT SUBSTR(guid, INSTR(guid, 'chat')) 
            FROM chat 
            WHERE display_name = ?
        )
    """, (desiredChatName,))

    cursor.execute("""
        SELECT destination_caller_id
        FROM GroupMsgs
        WHERE destination_caller_id IS NOT NULL
    """)

    test = cursor.fetchall()
    try:
        user_num = test[0][0]
    
    except:
        print( "Error: Please enter an exact group chat name. Copy and paste it from your messages. make sure your uploaded file is titled \"chat.db\"")
        return
    cursor.execute("INSERT OR REPLACE INTO handle (ROWID, id, service) VALUES (?, ?, ?)", (0, user_num, "iMessage"))

    cursor.execute("DROP TABLE IF EXISTS NumbersForEachMsg")

    cursor.execute("""
        CREATE TABLE NumbersForEachMsg AS
        SELECT *
        FROM GroupMsgs
        INNER JOIN handle ON GroupMsgs.handle_id = handle.ROWID;
    """)

    cursor.execute("SELECT id FROM NumbersForEachMsg")
    phone_numbers = cursor.fetchall()
    phone_number_counts = {}
    maxCount = 0

    for number in phone_numbers:
        number = number[0]
        if number in phone_number_counts:
            phone_number_counts[number] += 1
        else:
            phone_number_counts[number] = 1
        if maxCount < phone_number_counts[number]:
            maxCount = phone_number_counts[number]

    for number, count in phone_number_counts.items():
        phone_number_counts[number] = float(count) / float(maxCount)

    cursor.execute("SELECT date, date_read, id FROM NumbersForEachMsg WHERE date_read != 0")
    times = cursor.fetchall()
    time_difference = {}
    maxTime = 0

    for time in times:
        diff = time[1] - time[0]
        if time[2] in time_difference:
            time_difference[time[2]] += diff
        else:
            time_difference[time[2]] = diff
        if maxTime < int(time_difference[time[2]]):
            maxTime = time_difference[time[2]]

    for number, count in time_difference.items():
        time_difference[number] = float(count) / float(maxTime)

    noise = {}
    for number, count in phone_number_counts.items():
        random_number = random.random()
        noise[number] = random_number

    cursor.execute("SELECT text, id, date FROM NumbersForEachMsg")
    hoursForIncreasePoints = 7200000000000  # 2 hours
    pointsForReply = 5
    hoursForDecreasePoints = 18000000000000  # 5 hours
    pointsForNoReply = -5

    textIdDate = cursor.fetchall()
    points = {}
    maxPoints = 0
    breakBothLoops = False

    for i in range(0, len(textIdDate) - 1):
        noRecentReplies = True
        if textIdDate[i][1] != textIdDate[i + 1][1]:
            count = i
            while textIdDate[count + 1][2] - textIdDate[i][2] < hoursForIncreasePoints:
                noRecentReplies = False
                if count + 2 == len(textIdDate):
                    breakBothLoops = True
                    break
                if textIdDate[i][1] != textIdDate[count + 1][1]:
                    if textIdDate[i][1] not in points:
                        points[textIdDate[i][1]] = pointsForReply
                    else:
                        points[textIdDate[i][1]] += pointsForReply
                count += 1
            if breakBothLoops:
                break
            if (textIdDate[i + 1][2] - textIdDate[i][2] > hoursForDecreasePoints) and noRecentReplies:
                if textIdDate[i][1] not in points:
                    points[textIdDate[i][1]] = pointsForNoReply
                else:
                    points[textIdDate[i][1]] += pointsForNoReply
            if textIdDate[i][1] not in points:
                points[textIdDate[i][1]] = 1
            else:
                points[textIdDate[i][1]] += 1

            if points[textIdDate[i][1]] > maxPoints:
                maxPoints = points[textIdDate[i][1]]

    for num, point in points.items():
        points[num] = float(point) / max(float(maxPoints), 1)

    result = {}
    time_diff_weight = 0
    noise_weight = 0.1
    msg_count_weight = 0.25
    points_weight = 0.65

    common_phone_nums = set(noise.keys()).intersection(points.keys(), phone_number_counts.keys())

    for num in common_phone_nums:
        PNresult = noise[num] * noise_weight + phone_number_counts[num] * msg_count_weight + points[num] * points_weight
        result[num] = PNresult

    sorted_result = dict(sorted(result.items(), key=lambda item: item[1], reverse=True))
    i = -1

    for number, score in sorted_result.items():
        number = number[2:]
        number = f"{number[:3]}-{number[3:6]}-{number[6:]}"
        score = int(score*100)
        i += 1
        if i == 0:
            print("Your group leader is: "+ str(number)+ " with a score of " +  str(score)+"%")
            continue
        mainThreshold = 1 + int(float(len(sorted_result)) * float(0.2))
        if i < mainThreshold:
            print(str(number) + " is a main character, with a score of " + str(score) + "%")
        else:
            break
            #print("ALERT: side character", number, "is a side character, with a score of", score)

    cursor.close()
    connection.close()



if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python3 FGLAlgo.py <desired_chat_name>")
        sys.exit(1)

    desired_chat_name = sys.argv[1]
    analyze_chat(desired_chat_name)