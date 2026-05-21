import { simpleGit } from 'simple-git'

export async function readGitData(projectPath) {
  const git = simpleGit(projectPath)
  const isRepo = await git.checkIsRepo().catch(() => false)
  if (!isRepo) return null

  const [log, status, branches] = await Promise.all([
    git.log({ maxCount: 5 }).catch(() => null),
    git.status().catch(() => null),
    git.branch().catch(() => null),
  ])

  const recentCommits = log?.all?.map(c => ({
    hash: c.hash.slice(0, 7),
    message: c.message,
    date: c.date,
    author: c.author_name,
  })) ?? []

  return {
    currentBranch: branches?.current ?? 'unknown',
    lastCommit: recentCommits[0] ?? null,
    recentCommits,
    uncommittedChanges: status?.files?.length ?? 0,
  }
}
