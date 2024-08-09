import { DefaultFont } from '@/constants/Fonts';
import { LinearProgress } from '@rneui/themed';
import {
    View,
    Text,
    StyleSheet,
    ScrollView
} from 'react-native';
import AnimatedProgressWheel from 'react-native-progress-wheel';

const progressWheelOptions = (progress) => {
    return {
        color: 'darkseagreen',
        backgroundColor: 'lightgray',
        size: 170,
        width: 10,
        duration: 600,
        progress: progress,
        rounded: true
    }
}

const renderCurrentGoal = () => {
    const visited = 1;
    const totalBeachGoal = 6;
    const caption = `Complete your goal this month and unlock achievements. Share it with your friends!`;
    const progress = 0.2

    return (
        <View
            key={'_currGoal'}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                margin: 10,
            }}
        >
            <Text
                key={'_currGoal_header'}
                style={styles.headerText}
            >
                Current Goal
            </Text>
            <View
                key={'_currGoal_msg'}
                style={{
                    flex: 1,
                    flexDirection: 'row'
                }}
            >
                <Text
                    style={{
                        ...styles.headerText,
                        fontSize: 40,
                        alignSelf: 'center',
                    }}
                >
                    {visited}
                </Text>
                <Text
                    style={{
                        ...styles.headerText,
                        fontSize: 14,
                        fontWeight: '500',
                        marginLeft: 5,
                        color: 'darkgray',
                        alignSelf: 'center'
                    }}
                >
                    {`/${totalBeachGoal} visited beaches`}
                </Text>
            </View>
            <LinearProgress
                key={'_currGoal_progress'}
                style={{
                    width: '100%',
                    marginBottom: 10,
                    borderRadius: 10,
                }}
                value={progress}
                variant="determinate"
            />
            <Text
                key={'_currGoal_caption'}
                style={{
                    ...styles.statsTitle,
                    flexWrap: 'wrap'
                }}
            >
                {caption}
            </Text>
        </View>
    )
}

const renderVisitedBeachList = () => {
    const data = [
        {
            name: 'Cemento Beach',
            dateRange: 'Feb 14, 2024',
            photosTaken: 3
        },
        {
            name: 'Casapsapan Beach',
            dateRange: 'Feb 13, 2024',
            photosTaken: 4
        },
        {
            name: 'Canawer Beach',
            dateRange: 'Feb 13, 2024',
            photosTaken: 2
        },
        {
            name: 'Pinamuntugan Beach',
            dateRange: 'Dec 20, 2023',
            photosTaken: 2
        },
    ]

    return (
        <View
            key={'_visited_bchList'}
            style={{
                backgroundColor: 'papayawhip',
                borderRadius: 10,
                padding: 15,
                margin: 10,
            }}
        >
            <Text style={styles.headerText}>Recent Visited Beaches</Text>
            {data.map((item) => (
                <View
                key={`_visited_bchList+${item.name}`}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        marginTop: 10,
                    }}>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 15,
                            color: 'black',
                            fontWeight: '200',
                        }}>{item.name}</Text>
                        <Text style={{
                            fontFamily: DefaultFont.fontFamily,
                            fontSize: 10,
                            color: 'gray'
                        }}>{item.dateRange}</Text>
                    </View>
                    <Text style={{
                        fontFamily: DefaultFont.fontFamily,
                        fontSize: 12,
                        alignSelf: 'center',
                        color: 'black',
                        fontWeight: 'bold',
                    }}>{item.photosTaken} photos</Text>
                </View>
            ))}
        </View>
    )
}

export default function ProgressListLayout() {
    const totalBeaches = 300;
    const visitedBeaches = 25;
    const stats = [
        {
            statsCount: 2,
            title: 'Regions'
        },
        {
            statsCount: 3,
            title: 'Provinces'
        },
        {
            statsCount: 5,
            title: 'Municipalities'
        },
    ]

    const renderStats = (statsCount, title) => {
        return (
            <View
                key={`_stats+${title}_${statsCount}`}
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Text style={styles.statsCount}>{statsCount}</Text>
                <Text style={styles.statsTitle}>{title}</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.root}>
            <View
                key={'_progWhl_container'}
                style={styles.container}
            >
                <AnimatedProgressWheel
                    key={'_progWhl'}
                    max={totalBeaches}
                    showProgressLabel={true}
                    rotation={'-90deg'}
                    subtitle={`visited out of \r\n ${totalBeaches} beaches`}
                    labelStyle={styles.labelText}
                    subtitleStyle={styles.text}
                    animateFromValue={0}
                    {...progressWheelOptions(visitedBeaches)}
                />
            </View>
            <View
                key={'_stat_container'}
                style={styles.statsContainer}
            >
                {stats.map((stat) =>
                    renderStats(stat.statsCount, stat.title)
                )}
            </View>
            {renderCurrentGoal()}
            {renderVisitedBeachList()}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    container: {
        alignSelf: 'center',
        marginVertical: 20,
    },
    statsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 8,
    },
    headerText: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
    },
    text: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 10,
        color: 'gray'
    },
    statsCount: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'
    },
    statsTitle: {
        fontFamily: DefaultFont.fontFamily,
        fontSize: 12,
        color: 'gray'
    },
    labelText: {
        fontFamily: DefaultFont.fontFamily,
        fontWeight: 'bold',
        fontSize: 40
    },
});
