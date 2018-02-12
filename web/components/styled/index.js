import styled from 'react-emotion';

export const Flex = styled('div')`
  display: flex;
`;

export const FlexColumn = styled(Flex)`
  flex-direction: column;
`;

export const FlexColumnCenter = styled(FlexColumn)`
  align-items: center;
  justify-content: center;
`;
