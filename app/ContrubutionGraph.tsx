import { graphql } from '@octokit/graphql';

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  },
});

interface GraphQLResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        weeks: ContributionWeek[];
      };
    };
  };
}

interface ContributionWeek {
  contributionDays: {
    contributionCount: number;
    contributionLevel: number;
    date: string;
  }[];
}

const caption = 'JANDI';

export default async function ContributionGraph() {
  const weeks = await getWeeks();

  return (
    // 왜 y hidden해야하지??
    <div>
      <p className="text-gray-300 font-medium">GITHUB CONTIBUTION</p>
      <div className="flex leading-none text-lg overflow-x-scroll overflow-y-hidden no-scrollbar text-white">
        {weeks.map((week, idx) => {
          return (
            <div
              key={idx}
              className="flex flex-col whitespace-pre"
            >
              {week.contributionDays.map((day) => {
                return (
                  <span
                    key={day.date}
                    className="hover:bg-[#E9390B] text-[1rem] w-[.7rem] cursor-none"
                  >
                    {countToChar(day.contributionCount)}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const getWeeks = async () => {
  const resp: GraphQLResponse = await graphqlWithAuth(
    `query($userName:String!) {
    user(login: $userName){
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              contributionLevel
              date
            }
          }
        }
      }
    }
  }`,
    { userName: 'yeolyi' },
  );

  return resp.user.contributionsCollection.contributionCalendar.weeks;
};

const countToChar = (count: number) => {
  if (0xf < count) return '+';
  if (count === 0) return ' ';
  return '0123456789ABCDEF'[count];
};
