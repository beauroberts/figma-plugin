import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link1Icon, LinkBreak1Icon, EnterIcon, ExitIcon, ExternalLinkIcon,
} from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import Box from '../Box';
import Stack from '../Stack';
import { secondScreenSelector } from '@/selectors/secondScreenSelector';
import { Dispatch } from '@/app/store';
import { styled } from '@/stitches.config';
import { track } from '@/utils/analytics';
import { Switch, SwitchThumb } from '../Switch';
import Button from '../Button';
import Heading from '../Heading';
import { Divider } from '../Divider';

export const StyledBetaBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$xxsmall',
  padding: '$2',
  borderRadius: '$badge',
  backgroundColor: '$bgAccent',
  lineHeight: 1,
  color: '$fgDefault',
  fontWeight: '$bold',
  textTransform: 'uppercase',
  border: '1px solid transparent',
});

const StyledP = styled('p', {
  fontWeight: '$normal',
  color: '$text',
  fontSize: '$xsmall',
});

const StyledReadMoreLink = styled('a', {
  color: '$fgAccent',
  fontSize: '$xsmall',
});

export default function SecondScreen() {
  const { t } = useTranslation(['settings', 'general']);
  const isEnabled = useSelector(secondScreenSelector);
  const dispatch = useDispatch<Dispatch>();
  const { user, handleLogout } = useAuth();

  const onSyncClick = useCallback(() => {
    dispatch.uiState.toggleSecondScreen();
  }, [dispatch.uiState]);

  const handleOpenSecondScreen = useCallback(() => {
    track('Open second screen');
    window.open(process.env.SECOND_SCREEN_APP_URL);
  }, []);

  let statusColor;

  if (!user) {
    statusColor = '$fgSubtle';
  } else if (isEnabled && user) {
    statusColor = '$fgSuccess';
  } else {
    statusColor = '$fgDanger';
  }

  return (
    <Box className="content scroll-container">
      <Stack direction="column" gap={4} css={{ padding: '$3 0' }}>

        <Stack direction="column" gap={2} css={{ padding: '0 $4' }} justify="between" align="start">
          <Heading>
            Second Screen
            {' '}
            <StyledBetaBadge>BETA</StyledBetaBadge>
          </Heading>
          <StyledP>
            {t('secondScreenExplainer')}
          </StyledP>
          <StyledReadMoreLink href="https://docs.tokens.studio/sync/second-screen" target="_blank" rel="noreferrer">{t('readMore', { ns: 'general' })}</StyledReadMoreLink>
        </Stack>
        {
          user ? (
            <>
              <Stack direction="column" gap={2} css={{ padding: '0 $4' }}>

                <Stack
                  gap={4}
                  direction="row"
                  align="center"
                  justify="between"
                  css={{
                    backgroundColor: '$bgSubtle',
                    borderColor: statusColor,
                    borderWidth: '1px',
                    padding: '$3 $5',
                    fontSize: '$xsmall',
                    borderRadius: '6px',
                    color: statusColor,
                    marginBottom: '$3',
                    width: '100%',
                    height: '4rem',
                  }}
                >
                  <Stack
                    direction="column"
                    gap={1}
                  >
                    <Stack direction="row" align="center" gap={3} css={{ fontWeight: '$sansBold' }}>
                      {isEnabled && user ? <Link1Icon /> : <LinkBreak1Icon />}
                      {isEnabled && user ? t('connected') : t('notConnected')}
                    </Stack>
                    <Box>
                      {isEnabled && user ? t('liveSyncActive') : t('liveSyncInactive')}
                    </Box>

                  </Stack>

                  <Switch disabled={user === null} id="syncswitch" checked={isEnabled && !!user} onCheckedChange={onSyncClick}>
                    <SwitchThumb />
                  </Switch>
                </Stack>

                <Button disabled={user == null} variant="secondary" size="small" icon={<ExternalLinkIcon />} onClick={handleOpenSecondScreen}>
                  {t('openSecondScreen')}
                </Button>
              </Stack>

              <Divider />

              <Stack direction="column" gap={2} css={{ padding: '0 $4', alignItems: 'stretch' }}>

                <Button variant="secondary" size="small" icon={<ExitIcon />} onClick={handleLogout}>
                  {t('signOut')}
                </Button>
                <Box css={{
                  fontWeight: '$sansRegular', fontSize: '$xsmall', overflow: 'hidden', alignSelf: 'center', textOverflow: 'ellipsis',
                }}
                >
                  {t('signedInAs')}
                  {' '}
                  {user.email}
                </Box>
              </Stack>
            </>

          ) : (
            <Stack direction="column" gap={2} css={{ padding: '0 $4' }}>
              <Button variant="secondary" size="small" icon={<EnterIcon />} onClick={onSyncClick}>
                {t('signInToContinue')}
              </Button>
            </Stack>
          )
        }

      </Stack>
    </Box>
  );
}
